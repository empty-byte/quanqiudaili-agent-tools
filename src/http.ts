import type { CallToolResult } from '@modelcontextprotocol/server';
import { toForm } from './form.js';
import type { ToolDef } from './types.js';

export interface Cfg {
  baseUrl: string;
  token: string;
  timeoutMs: number;
}

export function cfgFromEnv(env: NodeJS.ProcessEnv = process.env): Cfg {
  const token = (env.QQDL_TOKEN ?? '').trim();
  if (!token) {
    throw new Error(
      '缺少环境变量 QQDL_TOKEN。请到全球代理网站的 API Keys 页面生成一个 API Key 填进来，做法见 README。' +
        '客户端可能无法继承另一个终端里的环境变量，请在客户端配置中提供 QQDL_TOKEN（如 claude mcp add -e QQDL_TOKEN=…），用 Inspector 调试时通过 -e 传入。',
    );
  }
  if (/[\x00-\x1f\x7f]/.test(token)) {
    throw new Error('QQDL_TOKEN 格式不正确：不能包含控制字符，请重新复制 API Key。');
  }
  const baseUrl = (env.QQDL_BASE_URL ?? 'https://admin.quanqiudaili.com').trim().replace(/\/+$/, '');
  const timeoutMs = Number(env.QQDL_TIMEOUT_MS ?? 30000);
  if (!Number.isInteger(timeoutMs) || timeoutMs <= 0) throw new Error('QQDL_TIMEOUT_MS 必须是正整数（毫秒）');
  return { baseUrl, token, timeoutMs };
}

export const text = (t: string, isError = false): CallToolResult => ({
  content: [{ type: 'text', text: t }],
  ...(isError ? { isError: true } : {}),
});

type Body = { code?: unknown; msg?: unknown; data?: unknown };

/** 只接受 JSON 对象；非 JSON、null、数组都当格式异常 */
function parseBody(raw: string): Body | undefined {
  try {
    const v: unknown = JSON.parse(raw);
    return v !== null && typeof v === 'object' && !Array.isArray(v) ? (v as Body) : undefined;
  } catch {
    return undefined;
  }
}

const pickField = (data: unknown, key: string): unknown =>
  (data && typeof data === 'object' ? (data as Record<string, unknown>)[key] : undefined) ?? null;

export async function callApi(
  tool: Pick<ToolDef, 'method' | 'path' | 'fixed' | 'pick'>,
  args: Record<string, unknown>,
  cfg: Cfg,
  fetchImpl: typeof fetch = fetch,
): Promise<CallToolResult> {
  const redact = (value: string) => value
    .replaceAll(JSON.stringify(cfg.token).slice(1, -1), '[已隐藏]')
    .replaceAll(cfg.token, '[已隐藏]');
  const fail = (message: string) => text(redact(message), true);

  // is_mcp_send 与 UA 让后端能区分 MCP 发出的请求
  const form = toForm({ ...args, ...tool.fixed, is_mcp_send: 1 }).toString();
  const url = new URL(cfg.baseUrl + tool.path);
  const headers: Record<string, string> = { token: cfg.token, accept: 'application/json', 'user-agent': 'quanqiudaili mcp' };
  // 鉴权请求不跟随重定向，避免把 token 转发到其他地址。
  const init: RequestInit = { method: tool.method, headers, redirect: 'error', signal: AbortSignal.timeout(cfg.timeoutMs) };
  if (tool.method === 'GET') {
    url.search = form;
  } else {
    headers['content-type'] = 'application/x-www-form-urlencoded';
    init.body = form;
  }

  let status: number;
  let raw: string;
  try {
    const res = await fetchImpl(url, init);
    status = res.status;
    raw = await res.text();
  } catch (e) {
    const err = e as Error & { cause?: { message?: string } };
    if (err.name === 'TimeoutError') return fail(`请求 ${tool.path} 超过 ${cfg.timeoutMs} ms 未响应`);
    const cause = err.cause?.message ? `（${err.cause.message}）` : '';
    return fail(`请求 ${tool.path} 失败：${err.message}${cause}`);
  }

  const body = parseBody(raw);
  const code = body && (typeof body.code === 'number' || typeof body.code === 'string' && body.code.trim()) ? Number(body.code) : NaN;
  if (!body || !Number.isFinite(code)) return fail(`HTTP ${status}，响应格式异常：${redact(raw).slice(0, 200)}`);

  const msg = String(body.msg ?? '');
  if (code === 401 || code === 403 || status === 401) {
    return fail(`token 无效（${msg}）。API Key 永久有效，但可能被删除或复制不完整：到网站 API Keys 页面核对或重新生成，更新 QQDL_TOKEN 后重启本 MCP。`);
  }
  if (status < 200 || status >= 300) return fail(`HTTP ${status}，请求失败${msg ? `：${msg}` : ''}`);
  if (code === 1) return text(JSON.stringify({ code, msg, data: tool.pick ? pickField(body.data, tool.pick) : body.data ?? null }));
  if (msg.includes('访问频繁')) return fail(`${msg} 后端限流为每个接口每 IP 每分钟 180 次，请稍后重试。`);
  return fail(body.data == null ? msg : `${msg}\n${JSON.stringify(body.data)}`);
}
