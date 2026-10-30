import { createHash, randomUUID } from 'node:crypto';
import { existsSync, lstatSync, mkdirSync, readFileSync, readdirSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { homedir } from 'node:os';
import { INSTALL_AGENTS, isWithin, makeServerEntry, mergeServer, parseConfig, resolveTarget, serverEntry, type InstallAgent, type InstallScope, type InstallTarget } from './install-config.js';

export interface InstallOptions {
  agents: InstallAgent[];
  scope: InstallScope;
  cwd: string;
  sourceRoot: string;
  token?: string;
  home?: string;
  readonly?: boolean;
  dryRun?: boolean;
  replace?: boolean;
}
export interface InstallResult {
  runtimePath: string;
  targets: InstallTarget[];
  changedFiles: string[];
}
interface ManagedAgent {
  configPath: string;
  entryHash: string;
  skillPath: string;
  skillFiles: Record<string, string>;
}
interface State { version: 1; agents: Partial<Record<InstallAgent, ManagedAgent>> }
interface Change { path: string; before: Buffer | null; after: Buffer; backup?: boolean }

/**
 * 计算安装内容摘要，用来识别版本和用户修改。
 *
 * @param value 文件内容或序列化数据。
 * @return string，SHA-256 摘要，不保存原始凭据。
 */
function digest(value: string | Buffer): string {
  return createHash('sha256').update(value).digest('hex');
}

/**
 * 对配置值排序，使相同配置不因键顺序不同而被识别为冲突。
 *
 * @param value 配置值。
 * @return string，可稳定比较的 JSON 文本。
 */
function stable(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stable).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.keys(value).sort().map(k => `${JSON.stringify(k)}:${stable((value as Record<string, unknown>)[k])}`).join(',')}}`;
  return JSON.stringify(value) ?? 'null';
}

/**
 * 拒绝通过符号链接或目录联接写入其他位置。
 *
 * @param path 安装目标或源文件路径。
 * @return void，不返回业务结果。
 */
function rejectLinks(path: string): void {
  let current = resolve(path);
  while (true) {
    if (existsSync(current) && lstatSync(current).isSymbolicLink()) throw new Error(`安装路径包含符号链接或目录联接：${current}`);
    const parent = dirname(current);
    if (parent === current) break;
    current = parent;
  }
}

/**
 * 收集技能文件，安装后不依赖源码仓库外部的路径。
 *
 * @param root 技能目录。
 * @param current 当前扫描目录，省略时从技能根开始。
 * @return Map<string, Buffer>，相对路径和文件内容的映射。
 */
function collect(root: string, current = root): Map<string, Buffer> {
  rejectLinks(current);
  const result = new Map<string, Buffer>();
  for (const item of readdirSync(current, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const path = join(current, item.name);
    if (item.isSymbolicLink()) throw new Error('技能包包含符号链接，不能安装。');
    if (item.isDirectory()) for (const entry of collect(root, path)) result.set(...entry);
    else if (item.isFile()) result.set(relative(root, path), readFileSync(path));
    else throw new Error('技能包包含不支持的文件类型。');
  }
  return result;
}

/**
 * 读取安装状态，只接受本安装器生成的结构。
 *
 * @param path 安装状态文件路径。
 * @return State，已管理的客户端记录；首次安装返回空记录。
 */
function readState(path: string): State {
  if (!existsSync(path)) return { version: 1, agents: {} };
  try {
    const state = JSON.parse(readFileSync(path, 'utf8')) as State;
    if (state.version !== 1 || !state.agents || typeof state.agents !== 'object' || Array.isArray(state.agents)) throw new Error();
    for (const [id, entry] of Object.entries(state.agents)) {
      if (!(id in INSTALL_AGENTS) || !entry || typeof entry.configPath !== 'string' || typeof entry.entryHash !== 'string'
        || typeof entry.skillPath !== 'string' || !entry.skillFiles || typeof entry.skillFiles !== 'object') throw new Error();
    }
    return state;
  } catch {
    throw new Error('安装记录无法解析；未修改客户端配置。');
  }
}

/**
 * 先写临时文件再替换目标，避免客户端读到半份配置。
 *
 * @param path 最终目标路径。
 * @param content 完整文件内容。
 * @return void，不返回业务结果。
 */
function atomicWrite(path: string, content: Buffer): void {
  mkdirSync(dirname(path), { recursive: true });
  const temp = `${path}.qqdl-${randomUUID()}.tmp`;
  try {
    writeFileSync(temp, content, { mode: 0o600, flag: 'wx' });
    renameSync(temp, path);
  } finally {
    if (existsSync(temp)) rmSync(temp);
  }
}

/**
 * 一次安装或更新选定客户端的 Skill 和 MCP，所有冲突先检查再写入。
 *
 * @param options 安装目标、范围、包根目录和凭据；dryRun 只列路径，不要求 token。
 * @return InstallResult，稳定运行入口、客户端目标和实际需要写入的文件路径，不包含凭据。
 */
export function installBundle(options: InstallOptions): InstallResult {
  const home = resolve(options.home ?? homedir());
  const cwd = resolve(options.cwd);
  if (!['user', 'project'].includes(options.scope)) throw new Error('scope 只能是 user 或 project。');
  const ids = [...new Set(options.agents)];
  if (!ids.length || ids.some(id => !Object.hasOwn(INSTALL_AGENTS, id))) throw new Error('请选择支持的 Agent，可先执行 install --list。');
  const token = options.token?.trim();
  if (!options.dryRun && (!token || /[\x00-\x1f\x7f]/.test(token))) throw new Error('需要有效的 QQDL_TOKEN；可通过环境变量、交互输入或 --token-stdin 提供。');
  const sourceRoot = resolve(options.sourceRoot);
  const skillFiles = collect(join(sourceRoot, 'skills', 'quanqiudaili'));
  if (!skillFiles.has('SKILL.md')) throw new Error('安装包缺少 SKILL.md，请先运行 npm run build。');
  const bundle = join(sourceRoot, 'dist', 'runtime', 'index.js');
  if (!existsSync(bundle)) throw new Error('安装包缺少独立运行时，请先运行 npm run build。');
  const sourceFiles = new Map<string, Buffer>([
    ['dist/src/index.js', readFileSync(bundle)],
    ['package.json', readFileSync(join(sourceRoot, 'package.json'))],
    ['spec/tools.json', readFileSync(join(sourceRoot, 'spec', 'tools.json'))],
    ['spec/dynamic-proxy-session.md', readFileSync(join(sourceRoot, 'spec', 'dynamic-proxy-session.md'))],
  ]);
  for (const [path, data] of skillFiles) sourceFiles.set(join('skills', 'quanqiudaili', path), data);
  const identity = digest([...sourceFiles].map(([path, data]) => `${path.replaceAll('\\', '/')}\0${digest(data)}`).join('\n')).slice(0, 24);
  const runtimeRoot = join(home, '.quanqiudaili-agent-tools', 'versions', identity);
  const runtimePath = join(runtimeRoot, 'dist', 'src', 'index.js');
  const statePath = options.scope === 'user'
    ? join(home, '.quanqiudaili-agent-tools', 'install.json')
    : join(cwd, '.quanqiudaili-agent-tools', 'install.json');
  rejectLinks(statePath);
  const oldState = readState(statePath);
  const state: State = { version: 1, agents: { ...oldState.agents } };
  const changes = new Map<string, Change>();
  const configEntries = new Map<string, string>();

  // 预检仅收集内存变更；后面的客户端出错时，前面的客户端也不会被改动。
  const add = (path: string, data: Buffer, backup = false): void => {
    rejectLinks(path);
    const prior = changes.get(path);
    if (prior && !prior.after.equals(data)) throw new Error(`多个 Agent 的安装内容冲突：${path}`);
    const before = prior?.before ?? (existsSync(path) ? readFileSync(path) : null);
    if (!before?.equals(data)) changes.set(path, { path, before, after: data, backup });
  };
  for (const [path, data] of sourceFiles) {
    const target = join(runtimeRoot, path);
    if (!isWithin(runtimeRoot, target)) throw new Error('运行包路径超出安装目录。');
    if (existsSync(target) && !readFileSync(target).equals(data)) throw new Error('已安装运行包内容已被修改，请检查安装目录。');
    add(target, data);
  }
  const targets = ids.map(id => resolveTarget(id, options.scope, cwd, home));
  for (const target of targets) {
    rejectLinks(target.configPath);
    const original = existsSync(target.configPath) ? readFileSync(target.configPath, 'utf8') : '';
    const config = parseConfig(original, target.format);
    const previous = serverEntry(config, target.key);
    const entry = makeServerEntry(target, runtimePath, token ?? 'DRY_RUN_TOKEN', options.readonly ?? false);
    const entryText = stable(entry);
    const configId = `${target.configPath}\0${target.key}`;
    const plannedEntry = configEntries.get(configId);
    if (plannedEntry && plannedEntry !== entryText) throw new Error(`${target.agent} 与其他 Agent 共用同名 MCP 配置且格式不同，请分别使用用户级安装。`);
    configEntries.set(configId, entryText);
    const old = oldState.agents[target.agent];
    const owned = old?.configPath === target.configPath && old.entryHash === digest(stable(previous));
    if (previous !== undefined && stable(previous) !== entryText && !owned && !options.replace) {
      throw new Error(`${target.agent} 已有不同的 quanqiudaili 配置。保留原配置；如需替换此服务，请显式加 --replace。`);
    }
    // 配置完全相同时不重排文件；TOML 变更会保存原文备份。
    if (previous === undefined || stable(previous) !== entryText) add(target.configPath, Buffer.from(mergeServer(original, target, entry)), true);
    const hashes: Record<string, string> = {};
    for (const [path, data] of skillFiles) {
      const destination = join(target.skillPath, path);
      rejectLinks(destination);
      const before = existsSync(destination) ? readFileSync(destination) : null;
      const wasManaged = Object.values(oldState.agents).some(record => record?.skillPath === target.skillPath && record.skillFiles[path] === (before ? digest(before) : undefined));
      if (before && !before.equals(data) && !wasManaged && !options.replace) throw new Error(`技能文件已有用户修改，未覆盖：${destination}。需要替换时使用 --replace。`);
      add(destination, data, before !== null);
      hashes[path] = digest(data);
    }
    state.agents[target.agent] = { configPath: target.configPath, entryHash: digest(entryText), skillPath: target.skillPath, skillFiles: hashes };
  }
  add(statePath, Buffer.from(`${JSON.stringify(state, null, 2)}\n`));
  const result = { runtimePath, targets, changedFiles: [...changes.keys()] };
  if (options.dryRun) return result;

  // 再检查一次原文，防止预检期间客户端更新配置后被本次安装覆盖。
  for (const item of changes.values()) {
    rejectLinks(item.path);
    const current = existsSync(item.path) ? readFileSync(item.path) : null;
    if (item.before === null ? current !== null : current === null || !current.equals(item.before)) {
      throw new Error('安装期间目标文件发生变化，请重新执行安装。');
    }
  }
  const applied: Change[] = [];
  try {
    for (const item of changes.values()) {
      if (item.backup && item.before !== null) {
        const backup = `${item.path}.qqdl-backup-${digest(item.before).slice(0, 12)}`;
        rejectLinks(backup);
        if (!existsSync(backup)) atomicWrite(backup, item.before);
      }
      atomicWrite(item.path, item.after);
      applied.push(item);
    }
  } catch {
    let restored = true;
    for (const item of applied.reverse()) {
      try {
        if (item.before === null) rmSync(item.path);
        else atomicWrite(item.path, item.before);
      } catch { restored = false; }
    }
    throw new Error(restored ? '安装写入失败，已恢复本次修改的文件。' : '安装写入失败，部分文件无法恢复，请检查原文备份。');
  }
  return result;
}
