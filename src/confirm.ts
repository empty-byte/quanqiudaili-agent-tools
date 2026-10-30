import { createHash, randomBytes } from 'node:crypto';
import { inputRequired, inputResponse, type CallToolResult, type InputRequiredResult, type ServerContext } from '@modelcontextprotocol/server';
import { text } from './http.js';
import type { JsonSchema, ToolDef } from './types.js';

export const TOKEN_TTL_MS = 5 * 60_000;
export const TOKEN_QUIET_MS = 10_000;

export const CONFIRM_TOKEN_SCHEMA: JsonSchema = {
  type: 'string',
  description: '确认码。客户端不支持弹窗确认时，第一次调用只返回操作预览和确认码；把预览告诉用户并得到同意后，用相同参数带上确认码再调一次。支持弹窗确认的客户端不需要这个参数',
};

/** 给用户看的操作预览：工具、首句说明、逐个参数；product_type_id 带上中文产品名 */
export function preview(tool: ToolDef, args: Record<string, unknown>): string {
  const lines = [`${tool.title}（${tool.name}）`, tool.description.split(/[。；]/)[0]];
  for (const [k, v] of Object.entries(args)) {
    if (v === undefined || v === null) continue;
    lines.push(`- ${k}：${render(tool, k, v)}`);
  }
  return lines.join('\n');
}

function render(tool: ToolDef, key: string, v: unknown): string {
  if (key === 'product_type_id') {
    const desc = tool.inputSchema.properties.product_type_id?.description ?? '';
    const m = desc.match(new RegExp(`${String(v)}=([^，,]+)`));
    return m ? `${String(v)}（${m[1]}）` : String(v);
  }
  return typeof v === 'object' ? JSON.stringify(v) : String(v);
}

const canon = (v: unknown): unknown =>
  Array.isArray(v) ? v.map(canon)
  : v && typeof v === 'object' ? Object.fromEntries(Object.keys(v).sort().map(k => [k, canon((v as Record<string, unknown>)[k])]))
  : v;
const fingerprint = (tool: string, args: Record<string, unknown>): string =>
  createHash('sha256').update(tool + JSON.stringify(canon(args))).digest('hex');

/**
 * 客户端不支持弹窗确认时用的一次性确认码：绑定工具与参数，过期或参数变了都作废。
 * 静默期用于阻止拿到确认码后的立即重调；提前使用不消费确认码，只顺延可用时间。
 * 时间检查无法判断用户是否同意；调用方仍须展示预览并等待真实的明确确认，不能以等待到期代替确认。
 */
export class ConfirmTokens {
  private pending = new Map<string, { fp: string; expires: number; notBefore: number }>();
  constructor(private now: () => number = Date.now, private quietMs: number = TOKEN_QUIET_MS) {}

  issue(tool: string, args: Record<string, unknown>): string {
    const token = randomBytes(4).toString('hex');
    const t = this.now();
    this.pending.set(token, { fp: fingerprint(tool, args), expires: t + TOKEN_TTL_MS, notBefore: t + this.quietMs });
    return token;
  }

  consume(token: string, tool: string, args: Record<string, unknown>): 'ok' | 'unknown' | 'expired' | 'mismatch' | 'too_soon' {
    const p = this.pending.get(token);
    if (!p) return 'unknown';
    const t = this.now();
    if (p.expires < t) {
      this.pending.delete(token);
      return 'expired';
    }
    if (p.fp !== fingerprint(tool, args)) {
      this.pending.delete(token);
      return 'mismatch';
    }
    if (t < p.notBefore) {
      p.notBefore = t + this.quietMs;
      return 'too_soon';
    }
    this.pending.delete(token);
    return 'ok';
  }
}

export interface ConfirmDeps {
  supportsElicitation: (ctx: ServerContext) => boolean;
  exec: (args: Record<string, unknown>) => Promise<CallToolResult>;
  tokens: ConfirmTokens;
}

/**
 * 写操作先确认再执行。客户端支持弹窗（elicitation）就弹给用户点；不支持就退到确认码：
 * 第一次调用只回预览和确认码，模型转述给用户后带码重调。
 */
export function withConfirm(tool: ToolDef, deps: ConfirmDeps) {
  return async (input: Record<string, unknown>, ctx: ServerContext): Promise<CallToolResult | InputRequiredResult> => {
    const { confirm_token, ...args } = input;

    if (typeof confirm_token === 'string' && confirm_token) {
      const state = deps.tokens.consume(confirm_token, tool.name, args);
      if (state === 'mismatch') return text('确认码对应的参数与本次不同，已作废。请不带确认码重新调用，重新向用户确认。', true);
      if (state === 'too_soon') {
        return text('确认码还不能用：静默期尚未结束，本次尝试已顺延可用时间。时间检查不能判断用户是否同意；尚未取得同意时，必须先把预览告诉用户并等待明确回复。不要立刻重试，也不要只等待静默期到期就自行提交。每一次操作都要单独确认，之前确认过同样的操作也不例外。', true);
      }
      if (state !== 'ok') return text('确认码无效或已过期。请不带确认码重新调用，重新向用户确认。', true);
      return deps.exec(args);
    }

    let note = '';
    if (deps.supportsElicitation(ctx)) {
      const answer = inputResponse(ctx.mcpReq.inputResponses, 'confirm');
      if (answer.kind === 'missing') {
        return inputRequired({
          inputRequests: {
            confirm: inputRequired.elicit({
              message: `${preview(tool, args)}\n\n确认执行以上操作？`,
              requestedSchema: {
                type: 'object',
                properties: { confirm: { type: 'boolean', title: '确认执行', description: '勾选表示同意执行上述操作' } },
                required: ['confirm'],
              },
            }),
          },
        });
      }
      if (answer.kind === 'elicit' && answer.action === 'accept' && answer.content?.confirm === true) return deps.exec(args);
      // 有的客户端（如 Claude Code 的 VS Code 插件）声明能弹窗，却不显示就直接回 decline，
      // 把它当拒绝会让写操作在这类客户端永远做不成；弹窗没拿到同意就一律退到确认码，让用户在对话里确认
      note = '弹窗没有得到确认（可能客户端没显示弹窗，也可能用户拒绝了）。';
    }

    const token = deps.tokens.issue(tool.name, args);
    return text(
      `${note}待确认，尚未执行。\n${preview(tool, args)}\n\n请把以上内容原样告诉用户；用户明确同意后，用相同参数加 confirm_token=${token} 再调用一次（5 分钟内有效，只能用一次，还需满足静默期限制）。静默期不能判断用户是否同意，时间到了也不能自行提交。用户不同意就不要再调。每一次操作都要单独确认，之前确认过同样的操作也不例外。`,
      false,
    );
  };
}
