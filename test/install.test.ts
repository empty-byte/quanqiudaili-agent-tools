import { createHash } from 'node:crypto';
import { execFile } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, readlinkSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { promisify } from 'node:util';
import { Client } from '@modelcontextprotocol/client';
import { StdioClientTransport } from '@modelcontextprotocol/client/stdio';
import TOML from '@iarna/toml';
import { parse } from 'jsonc-parser';
import { afterEach, describe, expect, it } from 'vitest';
import { INSTALL_AGENTS, resolveTarget, type InstallAgent, type InstallTarget } from '../src/install-config.js';
import { installBundle } from '../src/install.js';

const projectRoot = resolve('.');
const allocated: string[] = [];
const fakeToken = 'sk-install-fixture-not-a-real-key';

/**
 * 创建独立安装环境，所有用户级和项目级配置都落在临时目录。
 *
 * @return {{ root: string; home: string; cwd: string }} 返回临时根目录、用户目录和含空格的项目目录。
 */
function sandbox(): { root: string; home: string; cwd: string } {
  const root = mkdtempSync(join(tmpdir(), 'qqdl-install-test-'));
  allocated.push(root);
  const home = join(root, 'fake home');
  const cwd = join(root, 'workspace with spaces');
  mkdirSync(home);
  mkdirSync(cwd);
  return { root, home, cwd };
}

/**
 * 验证测试写入和清理位置位于明确分配的临时根目录。
 *
 * @param root 本测试分配的临时根目录。
 * @param path 待操作的绝对路径。
 * @return void 不返回业务结果；越界时抛出错误。
 */
function requireInside(root: string, path: string): void {
  const rel = relative(resolve(root), resolve(path));
  if (isAbsolute(rel) || rel === '..' || rel.startsWith(`..${sep}`)) throw new Error('测试路径越过临时根目录');
}

afterEach(() => {
  for (const root of allocated.splice(0)) {
    requireInside(tmpdir(), root);
    if (!root.startsWith(join(tmpdir(), 'qqdl-install-test-'))) throw new Error('拒绝清理非测试目录');
    rmSync(root, { recursive: true, force: true });
  }
});

/**
 * 读取安装后的服务配置，按客户端约定的父节点取得本项目条目。
 *
 * @param target 安装结果中对应客户端的目标配置。
 * @return Record<string, unknown> 返回全球代理服务的配置对象。
 */
function readEntry(target: Pick<InstallTarget, 'configPath' | 'format' | 'key'>): Record<string, unknown> {
  const content = readFileSync(target.configPath, 'utf8');
  const config = (target.format === 'toml' ? TOML.parse(content) : parse(content)) as Record<string, unknown>;
  let node = config;
  for (const part of target.key.split('.')) node = node[part] as Record<string, unknown>;
  return node.quanqiudaili as Record<string, unknown>;
}

/**
 * 遍历配置中的字符串，检查各客户端变换后的运行命令与确认参数。
 *
 * @param value 任意配置节点。
 * @return string[] 返回该节点及其子节点中的全部字符串值。
 */
function strings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (!value || typeof value !== 'object') return [];
  return Object.values(value).flatMap(strings);
}

/**
 * 记录目录结构和文件摘要，验证预览及失败路径没有留下任何写入。
 *
 * @param root 需要比对的临时根目录。
 * @return string[] 返回按路径排序的目录、链接和文件摘要。
 */
function snapshot(root: string): string[] {
  const records: string[] = [];
  const pending = [root];
  while (pending.length) {
    const current = pending.pop()!;
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const path = join(current, entry.name);
      const name = relative(root, path);
      if (entry.isSymbolicLink()) records.push(`${name}|link|${readlinkSync(path)}`);
      else if (entry.isDirectory()) {
        records.push(`${name}|directory`);
        pending.push(path);
      } else records.push(`${name}|file|${createHash('sha256').update(readFileSync(path)).digest('hex')}`);
    }
  }
  return records.sort();
}

/**
 * 复制真实发布输入到临时来源，避免测试依赖 npx 缓存或开发目录。
 *
 * @param root 临时测试根目录。
 * @return string 返回包含运行包、工具定义和技能的独立来源目录。
 */
function copySource(root: string): string {
  const source = join(root, 'temporary download');
  mkdirSync(source);
  for (const name of ['package.json', 'spec/tools.json', 'spec/dynamic-proxy-session.md', 'skills', 'dist/runtime/index.js']) {
    const destination = join(source, name);
    mkdirSync(dirname(destination), { recursive: true });
    cpSync(join(projectRoot, name), destination, { recursive: true });
  }
  return source;
}

describe('Skills 与 MCP 一体安装', () => {
  it('全部适配客户端在隔离用户目录获得技能与稳定运行入口，并保留写确认', () => {
    const env = sandbox();
    const agents = Object.keys(INSTALL_AGENTS) as InstallAgent[];
    const result = installBundle({ ...env, agents, scope: 'user', sourceRoot: projectRoot, token: fakeToken });
    expect(result.targets.map(target => target.agent).sort()).toEqual([...agents].sort());
    requireInside(env.home, result.runtimePath);
    expect(existsSync(result.runtimePath)).toBe(true);
    expect(result.runtimePath).toContain(`${sep}.quanqiudaili-agent-tools${sep}versions${sep}`);
    for (const target of result.targets) {
      requireInside(env.home, target.configPath);
      requireInside(env.home, target.skillPath);
      expect(readFileSync(join(target.skillPath, 'SKILL.md'), 'utf8')).toBe(readFileSync('skills/quanqiudaili/SKILL.md', 'utf8'));
      const entry = readEntry(resolveTarget(target.agent, 'user', env.cwd, env.home));
      expect(strings(entry), target.agent).toContain(result.runtimePath);
      expect(strings(entry), target.agent).toContain(process.execPath);
      expect(strings(entry), target.agent).toContain(fakeToken);
      expect(strings(entry), target.agent).not.toContain('--yes');
      expect(strings(entry), target.agent).not.toContain('npx');
    }
    expect(result.changedFiles.length).toBeGreaterThan(agents.length);
    expect(new Set(result.changedFiles).size).toBe(result.changedFiles.length);
  });

  it('JSONC 合并保留注释、尾逗号语义和其他 MCP，重复安装不再修改文件', () => {
    const env = sandbox();
    const target = resolveTarget('cursor', 'user', env.cwd, env.home);
    mkdirSync(dirname(target.configPath), { recursive: true });
    const existing = '{\n  // keep this user comment\n  "theme": "dark",\n  "mcpServers": { "unrelated": { "command": "other-tool", "args": ["serve"] }, },\n}\n';
    writeFileSync(target.configPath, existing);
    const options = { ...env, agents: ['cursor'] as InstallAgent[], scope: 'user' as const, sourceRoot: projectRoot, token: fakeToken };
    installBundle(options);
    const updated = readFileSync(target.configPath, 'utf8');
    expect(updated).toContain('// keep this user comment');
    expect(parse(updated)).toMatchObject({ theme: 'dark', mcpServers: { unrelated: { command: 'other-tool', args: ['serve'] } } });
    const before = snapshot(env.root);
    expect(installBundle(options).changedFiles).toEqual([]);
    expect(snapshot(env.root)).toEqual(before);
  });

  it('Codex TOML 合并保留模型设置、其他服务及其环境值', () => {
    const env = sandbox();
    const target = resolveTarget('codex', 'user', env.cwd, env.home);
    mkdirSync(dirname(target.configPath), { recursive: true });
    writeFileSync(target.configPath, 'model = "existing-model"\n[features]\nexisting = true\n[mcp_servers.other]\ncommand = "existing-server"\nargs = ["run"]\n[mcp_servers.other.env]\nOTHER_TOKEN = "unrelated-fixture"\n');
    installBundle({ ...env, agents: ['codex'], scope: 'user', sourceRoot: projectRoot, token: fakeToken });
    const config = TOML.parse(readFileSync(target.configPath, 'utf8'));
    expect(config).toMatchObject({
      model: 'existing-model',
      features: { existing: true },
      mcp_servers: { other: { command: 'existing-server', args: ['run'], env: { OTHER_TOKEN: 'unrelated-fixture' } } },
    });
    expect(readEntry(target).env).toEqual({ QQDL_TOKEN: fakeToken });
  });

  it('已有不同的同名服务时不覆盖，replace 只替换本项目条目', () => {
    const env = sandbox();
    const target = resolveTarget('cursor', 'user', env.cwd, env.home);
    mkdirSync(dirname(target.configPath), { recursive: true });
    const original = JSON.stringify({ mcpServers: { quanqiudaili: { command: 'legacy-server', args: ['old'] }, other: { command: 'keep-me' } } });
    writeFileSync(target.configPath, original);
    const options = { ...env, agents: ['cursor'] as InstallAgent[], scope: 'user' as const, sourceRoot: projectRoot, token: fakeToken };
    const before = snapshot(env.root);
    expect(() => installBundle(options)).toThrow();
    expect(snapshot(env.root)).toEqual(before);
    const result = installBundle({ ...options, replace: true });
    expect(strings(readEntry(target))).toContain(result.runtimePath);
    expect(parse(readFileSync(target.configPath, 'utf8')).mcpServers.other).toEqual({ command: 'keep-me' });
  });

  it('任一目标配置无法解析时，其他目标、技能与运行目录也不写入', () => {
    const env = sandbox();
    const target = resolveTarget('cursor', 'user', env.cwd, env.home);
    mkdirSync(dirname(target.configPath), { recursive: true });
    writeFileSync(target.configPath, '{"mcpServers": { "broken": ');
    const before = snapshot(env.root);
    expect(() => installBundle({ ...env, agents: ['claude-code', 'cursor'], scope: 'user', sourceRoot: projectRoot, token: fakeToken })).toThrow(/解析/);
    expect(snapshot(env.root)).toEqual(before);
  });

  it('dryRun 返回安装计划但不创建文件或目录', () => {
    const env = sandbox();
    const before = snapshot(env.root);
    const result = installBundle({ ...env, agents: ['cursor', 'codex'], scope: 'user', sourceRoot: projectRoot, token: fakeToken, dryRun: true });
    expect(result.targets).toHaveLength(2);
    expect(result.changedFiles.length).toBeGreaterThan(0);
    expect(snapshot(env.root)).toEqual(before);
    expect(existsSync(result.runtimePath)).toBe(false);
  });

  it('已有技能被用户修改时停止，replace 恢复包内容但保留无关文件', () => {
    const env = sandbox();
    const options = { ...env, agents: ['cursor'] as InstallAgent[], scope: 'user' as const, sourceRoot: projectRoot, token: fakeToken };
    const installed = installBundle(options);
    const skillPath = installed.targets[0].skillPath;
    writeFileSync(join(skillPath, 'SKILL.md'), '用户修改的技能内容。\n');
    writeFileSync(join(skillPath, 'my-notes.md'), '用户独立记录。\n');
    const before = snapshot(env.root);
    expect(() => installBundle(options)).toThrow(/修改|覆盖|冲突/);
    expect(snapshot(env.root)).toEqual(before);
    installBundle({ ...options, replace: true });
    expect(readFileSync(join(skillPath, 'SKILL.md'), 'utf8')).toBe(readFileSync('skills/quanqiudaili/SKILL.md', 'utf8'));
    expect(readFileSync(join(skillPath, 'my-notes.md'), 'utf8')).toBe('用户独立记录。\n');
  });

  it('缺少凭据或凭据包含控制字符时不安装、不回显密钥；无凭据仍可预览', () => {
    const env = sandbox();
    const options = { ...env, agents: ['cursor'] as InstallAgent[], scope: 'user' as const, sourceRoot: projectRoot };
    const before = snapshot(env.root);
    expect(() => installBundle(options)).toThrow(/QQDL_TOKEN/);
    expect(snapshot(env.root)).toEqual(before);
    let invalidMessage = '';
    try { installBundle({ ...options, token: 'sk-invalid\tprivate-value' }); }
    catch (error) { invalidMessage = (error as Error).message; }
    expect(invalidMessage).toMatch(/QQDL_TOKEN/);
    expect(invalidMessage).not.toContain('sk-invalid');
    expect(invalidMessage).not.toContain('private-value');
    expect(snapshot(env.root)).toEqual(before);
    expect(installBundle({ ...options, dryRun: true }).targets).toHaveLength(1);
    expect(snapshot(env.root)).toEqual(before);
  });

  it('项目级安装只写项目配置和技能，readonly 进入 MCP 启动参数', () => {
    const env = sandbox();
    const result = installBundle({ ...env, agents: ['cursor', 'codex', 'gemini-cli', 'opencode'], scope: 'project', sourceRoot: projectRoot, token: fakeToken, readonly: true });
    for (const target of result.targets) {
      requireInside(env.cwd, target.configPath);
      requireInside(env.cwd, target.skillPath);
      const entry = readEntry(resolveTarget(target.agent, 'project', env.cwd, env.home));
      expect(strings(entry)).toContain('--readonly');
      expect(strings(entry)).not.toContain('--yes');
    }
    expect(existsSync(join(env.home, '.cursor'))).toBe(false);
  });

  it('同次安装的客户端共用同一配置槽但要求不同格式时拒绝覆盖', () => {
    const env = sandbox();
    const before = snapshot(env.root);
    expect(() => installBundle({ ...env, agents: ['claude-code', 'github-copilot-cli'], scope: 'project', sourceRoot: projectRoot, token: fakeToken })).toThrow();
    expect(snapshot(env.root)).toEqual(before);
  });

  it('不支持项目级安装的客户端明确失败，不退回真实用户目录', () => {
    const env = sandbox();
    const before = snapshot(env.root);
    expect(() => installBundle({ ...env, agents: ['windsurf'], scope: 'project', sourceRoot: projectRoot, token: fakeToken })).toThrow(/项目级/);
    expect(snapshot(env.root)).toEqual(before);
  });

  it('来源技能包含目录链接时拒绝，不把链接目标打包或写入配置', () => {
    const env = sandbox();
    const sourceRoot = copySource(env.root);
    const outside = join(env.root, 'unrelated-files');
    mkdirSync(outside);
    writeFileSync(join(outside, 'do-not-copy.txt'), 'private fixture');
    symlinkSync(outside, join(sourceRoot, 'skills', 'quanqiudaili', 'linked-outside'), process.platform === 'win32' ? 'junction' : 'dir');
    const before = snapshot(env.root);
    expect(() => installBundle({ ...env, agents: ['cursor'], scope: 'user', sourceRoot, token: fakeToken })).toThrow();
    expect(snapshot(env.root)).toEqual(before);
  });

  it('来源下载目录删除后，已安装运行包仍能初始化并只读查询假后端', async () => {
    const env = sandbox();
    const sourceRoot = copySource(env.root);
    const result = installBundle({ ...env, agents: ['cursor'], scope: 'user', sourceRoot, token: fakeToken, readonly: true });
    const entry = readEntry(resolveTarget('cursor', 'user', env.cwd, env.home));
    requireInside(env.root, sourceRoot);
    rmSync(sourceRoot, { recursive: true, force: true });
    expect(existsSync(sourceRoot)).toBe(false);
    let requests = 0;
    const backend = createServer((_req, res) => {
      requests++;
      res.setHeader('content-type', 'application/json');
      res.end(JSON.stringify({ code: 1, msg: 'ok', data: { money: '88.00' } }));
    });
    await new Promise<void>(resolveListen => backend.listen(0, '127.0.0.1', resolveListen));
    const client = new Client({ name: 'installed-bundle-test', version: '1.0.0' }, { capabilities: {} });
    try {
      await client.connect(new StdioClientTransport({
        command: entry.command as string,
        args: entry.args as string[],
        cwd: env.cwd,
        env: {
          ...(entry.env as Record<string, string>),
          QQDL_BASE_URL: `http://127.0.0.1:${(backend.address() as { port: number }).port}`,
        },
        stderr: 'ignore',
      }));
      const tools = (await client.listTools()).tools;
      expect(tools).toHaveLength(20);
      expect(tools.every(tool => tool.annotations?.readOnlyHint)).toBe(true);
      const response = await client.callTool({ name: 'user_balance', arguments: {} });
      expect(response.isError).toBeFalsy();
      expect(JSON.parse((response.content as { text: string }[])[0].text).data).toBe('88.00');
      expect(requests).toBe(1);
      expect(existsSync(join(dirname(dirname(dirname(result.runtimePath))), 'node_modules'))).toBe(false);
    } finally {
      await client.close();
      backend.closeAllConnections();
      await new Promise<void>((resolveClose, reject) => backend.close(error => error ? reject(error) : resolveClose()));
    }
  }, 20_000);

  it('真实安装命令先鉴权，错误零写入，通过后保存同一 Key 和后端配置', async () => {
    const env = sandbox();
    const seen: string[] = [];
    const backend = createServer((req, res) => {
      seen.push(`${req.method} ${req.url}`);
      const authorized = req.headers.token === fakeToken;
      res.writeHead(authorized ? 200 : 401, { 'content-type': 'application/json' });
      res.end(JSON.stringify(authorized
        ? { code: 1, msg: 'ok', data: { id: 123, email: 'private@example.test' } }
        : { code: 401, msg: 'API Key 无效或已删除' }));
    });
    await new Promise<void>(done => backend.listen(0, '127.0.0.1', done));
    const baseUrl = `http://127.0.0.1:${(backend.address() as { port: number }).port}`;
    const childEnv = { ...process.env, HOME: env.home, USERPROFILE: env.home, QQDL_BASE_URL: baseUrl, QQDL_TIMEOUT_MS: '2000', QQDL_TOKEN: 'sk-wrong-fixture' };
    const run = promisify(execFile);
    const args = [join(projectRoot, 'dist/src/index.js'), 'install', '--agents', 'cursor', '--scope', 'project'];
    try {
      // 先确认子进程用户目录已隔离，避免测试碰到开发者的真实运行包。
      const homeCheck = await run(process.execPath, ['-p', 'require("node:os").homedir()'], { cwd: env.cwd, env: childEnv });
      expect(resolve(homeCheck.stdout.trim())).toBe(resolve(env.home));
      const before = snapshot(env.root);
      await expect(run(process.execPath, args, { cwd: env.cwd, env: childEnv })).rejects.toMatchObject({ code: 1, stderr: expect.stringContaining('验证失败') });
      expect(snapshot(env.root)).toEqual(before);
      const { stdout, stderr } = await run(process.execPath, args, { cwd: env.cwd, env: { ...childEnv, QQDL_TOKEN: fakeToken } });
      expect(stdout).toContain('验证通过');
      expect(stdout + stderr).not.toContain(fakeToken);
      expect(stdout + stderr).not.toContain('private@example.test');
      const target = resolveTarget('cursor', 'project', env.cwd, env.home);
      expect(readEntry(target).env).toEqual({ QQDL_TOKEN: fakeToken, QQDL_BASE_URL: baseUrl, QQDL_TIMEOUT_MS: '2000' });
      expect(existsSync(join(target.skillPath, 'SKILL.md'))).toBe(true);
      expect(seen).toEqual(Array(2).fill('GET /externalapi/user/getUserInfo?is_mcp_send=1'));
    } finally {
      backend.closeAllConnections();
      await new Promise<void>((done, reject) => backend.close(error => error ? reject(error) : done()));
    }
  }, 20_000);
});
