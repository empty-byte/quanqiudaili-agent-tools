import { agents, type AgentType } from 'add-mcp';
import { applyEdits, modify, parse, type ParseError } from 'jsonc-parser';
import TOML from '@iarna/toml';
import { homedir } from 'node:os';
import { isAbsolute, join, relative, resolve, sep } from 'node:path';

export const INSTALL_AGENTS = {
  'claude-code': { user: '.claude/skills', project: '.claude/skills' },
  cursor: { user: '.cursor/skills', project: '.cursor/skills' },
  codex: { user: '.agents/skills', project: '.agents/skills' },
  'gemini-cli': { user: '.gemini/skills', project: '.gemini/skills' },
  opencode: { user: '.agents/skills', project: '.agents/skills' },
  'github-copilot-cli': { user: '.copilot/skills', project: '.agents/skills' },
  vscode: { user: '.copilot/skills', project: '.agents/skills' },
  windsurf: { user: '.codeium/windsurf/skills', project: '.windsurf/skills' },
  'kiro-cli': { user: '.kiro/skills', project: '.kiro/skills' },
  zed: { user: '.agents/skills', project: '.agents/skills' },
  cline: { user: '.agents/skills', project: '.agents/skills' },
} as const satisfies Partial<Record<AgentType, { user: string; project: string }>>;

export type InstallAgent = keyof typeof INSTALL_AGENTS;
export type InstallScope = 'user' | 'project';
export interface InstallTarget {
  agent: InstallAgent;
  configPath: string;
  skillPath: string;
  key: string;
  format: 'json' | 'toml';
  local: boolean;
}

/**
 * 判断路径是否位于指定目录内，避免安装内容越过目标目录。
 *
 * @param parent 允许的父目录。
 * @param child 待检查的路径。
 * @return boolean，是否为父目录本身或其下的路径。
 */
export function isWithin(parent: string, child: string): boolean {
  const rel = relative(resolve(parent), resolve(child));
  return rel === '' || (!isAbsolute(rel) && rel !== '..' && !rel.startsWith(`..${sep}`));
}

/**
 * 使用客户端适配表定位配置和技能目录。
 *
 * @param agent 受支持的客户端标识。
 * @param scope 用户级或项目级安装范围。
 * @param cwd 项目目录。
 * @param home 用户目录；测试传入临时目录，不触碰真实配置。
 * @return InstallTarget，配置路径、技能路径及文件格式。
 */
export function resolveTarget(agent: InstallAgent, scope: InstallScope, cwd: string, home = homedir()): InstallTarget {
  const adapter = agents[agent];
  const local = scope === 'project';
  if (local && !adapter.localConfigPath) throw new Error(`${agent} 不支持项目级 MCP 配置，请使用 --scope user。`);
  let configPath = adapter.resolveConfigPath?.(adapter, { local, cwd })
    ?? (local ? resolve(cwd, adapter.localConfigPath!) : adapter.configPath);
  // 测试可重定位用户目录，生产环境继续使用适配器解析的系统路径。
  if (!local && resolve(home) !== resolve(homedir())) {
    if (!isWithin(homedir(), configPath)) throw new Error('测试目录无法覆盖外部客户端配置路径。');
    configPath = resolve(home, relative(homedir(), configPath));
  }
  const format = adapter.format;
  if (format !== 'json' && format !== 'toml') throw new Error(`${agent} 暂不支持该配置格式。`);
  return {
    agent, configPath, format, local,
    key: local ? adapter.localConfigKey ?? adapter.configKey : adapter.configKey,
    skillPath: join(local ? cwd : home, INSTALL_AGENTS[agent][scope], 'quanqiudaili'),
  };
}

/**
 * 严格读取配置；解析错误时停止，避免覆盖损坏或不完整的文件。
 *
 * @param content 配置原文；不存在的文件使用空字符串。
 * @param format 配置文件格式。
 * @return Record<string, unknown>，配置对象，空文件返回空对象。
 */
export function parseConfig(content: string, format: InstallTarget['format']): Record<string, unknown> {
  if (!content.trim()) return {};
  try {
    const errors: ParseError[] = [];
    const result: unknown = format === 'toml' ? TOML.parse(content) : parse(content, errors, { allowTrailingComma: true });
    if (errors.length || !result || typeof result !== 'object' || Array.isArray(result)) throw new Error();
    return result as Record<string, unknown>;
  } catch {
    // 解析器错误可能带上含密钥的源行，只返回无原文的错误。
    throw new Error('客户端配置无法解析；未覆盖原文件，请先修复配置。');
  }
}

/**
 * 从配置中读取当前服务条目并检查父节点形状。
 *
 * @param config 已解析的配置对象。
 * @param key 客户端使用的 MCP 配置节点。
 * @return unknown，全球代理服务条目；未配置时返回 undefined。
 */
export function serverEntry(config: Record<string, unknown>, key: string): unknown {
  let current: Record<string, unknown> = config;
  for (const part of key.split('.')) {
    if (current[part] === undefined) return undefined;
    if (!current[part] || typeof current[part] !== 'object' || Array.isArray(current[part])) throw new Error('MCP 配置节点不是对象，未修改。');
    current = current[part] as Record<string, unknown>;
  }
  return current.quanqiudaili;
}

/**
 * 按客户端格式合并单个服务，保留其他设置的值。
 *
 * @param content 配置原文。
 * @param target 客户端的配置路径和格式。
 * @param entry 已按客户端转换的服务配置。
 * @return string，新配置文本；JSONC 保留其他节点的注释，TOML 会重新排版。
 */
export function mergeServer(content: string, target: InstallTarget, entry: unknown): string {
  const parsed = parseConfig(content, target.format);
  serverEntry(parsed, target.key);
  const path = [...target.key.split('.'), 'quanqiudaili'];
  if (target.format === 'json') {
    return applyEdits(content || '{}\n', modify(content || '{}\n', path, entry, {
      formattingOptions: { insertSpaces: true, tabSize: 2, eol: content.includes('\r\n') ? '\r\n' : '\n' },
    }));
  }
  let node = parsed;
  for (const part of path.slice(0, -1)) node = (node[part] ??= {}) as Record<string, unknown>;
  node.quanqiudaili = entry;
  return TOML.stringify(parsed as TOML.JsonMap);
}

/**
 * 为客户端生成本地 MCP 启动配置，保留默认写操作确认。
 *
 * @param target 客户端及其配置格式。
 * @param entryPath 已安装运行时的绝对入口路径。
 * @param token 用户提供的 API Key。
 * @param readonly 是否只开放查询工具。
 * @return unknown，客户端可识别的服务条目，不包含自动批准设置。
 */
export function makeServerEntry(target: InstallTarget, entryPath: string, token: string, readonly: boolean): unknown {
  return agents[target.agent].transformConfig('quanqiudaili', {
    command: process.execPath,
    args: [entryPath, ...(readonly ? ['--readonly'] : [])],
    env: { QQDL_TOKEN: token },
  }, { configKey: target.key, local: target.local });
}
