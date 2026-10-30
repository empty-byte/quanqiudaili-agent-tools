import { readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { setTimeout as delay } from 'node:timers/promises';
import { Client } from '@modelcontextprotocol/client';
import { StdioClientTransport } from '@modelcontextprotocol/client/stdio';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import type { ToolDef } from '../src/types.js';

type Arguments = Record<string, unknown>;
type WorkflowCase = { tool: string; arguments: Arguments; backendData?: unknown; checks?: { expectedData?: unknown } };
type Hit = { path: string; method: string; query: URLSearchParams; form: URLSearchParams; token?: string; userAgent?: string; contentType?: string };
type Setting = { is_renew: number; renew_with_bandwidth: number };
type Reply = { code: number; msg: string; data: unknown };
type Result = { content?: unknown; isError?: unknown };

const definitions = JSON.parse(readFileSync('spec/tools.json', 'utf8')) as ToolDef[];
const rawCases = JSON.parse(readFileSync('test/fixtures/skill-workflows.json', 'utf8')) as
  | { schemaVersion: number; cases: WorkflowCase[] }
  | { tool: string; args: Arguments }[];
const cases: WorkflowCase[] = Array.isArray(rawCases)
  ? rawCases.map(item => ({ tool: item.tool, arguments: item.args }))
  : rawCases.cases;
const hits: Hit[] = [];
let baseUrl = '';
let activeCase: WorkflowCase | undefined;
let accountSettings: Record<string, Setting> | undefined;
let forcedReply: Reply | undefined;
let hangWrites = false;

// 真实启动 MCP 进程并观察本地 HTTP 请求；这些脚本验证示例可执行性，不代替模型自由任务评估。
const backend = createServer((req, res) => {
  let body = '';
  req.on('data', chunk => { body += chunk; });
  req.on('end', () => {
    const url = new URL(req.url ?? '/', 'http://127.0.0.1');
    const hit: Hit = {
      path: url.pathname,
      method: req.method ?? '',
      query: url.searchParams,
      form: new URLSearchParams(body),
      token: req.headers.token as string | undefined,
      userAgent: req.headers['user-agent'],
      contentType: req.headers['content-type'],
    };
    hits.push(hit);
    if (hangWrites && hit.method === 'POST') return;

    const ids = hit.query.get('ids');
    const renewalLookup = url.pathname === '/externalapi/device/accountList' && ids && hit.query.get('pagesize') === '100';
    let data: unknown = activeCase?.backendData ?? { accepted: true };
    if (renewalLookup) {
      const rows = ids.split(',').filter(id => !accountSettings || accountSettings[id]).map(id => ({
        id,
        ...(accountSettings?.[id] ?? { is_renew: 1, renew_with_bandwidth: 1 }),
      }));
      data = { total: rows.length, rows };
    } else if (url.pathname === '/externalapi/user/getUserInfo' && activeCase?.backendData === undefined) {
      data = { money: '125.50', give_money: '0.00' };
    }
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify(forcedReply ?? { code: 1, msg: 'ok', data }));
  });
});

beforeAll(async () => {
  await new Promise<void>(resolve => backend.listen(0, '127.0.0.1', resolve));
  baseUrl = `http://127.0.0.1:${(backend.address() as { port: number }).port}`;
});

beforeEach(() => {
  hits.length = 0;
  activeCase = undefined;
  accountSettings = undefined;
  forcedReply = undefined;
  hangWrites = false;
});

afterAll(async () => {
  backend.closeAllConnections();
  await new Promise<void>((resolve, reject) => backend.close(error => error ? reject(error) : resolve()));
});

/**
 * 连接独立的 MCP 子进程，强制使用本地假后端和合成凭据。
 *
 * @param options 指定只读模式、弹窗回答、预览收集数组和请求超时。
 * 省略时启用全部工具，使用确认码流程和 5000 毫秒超时。
 * 弹窗回调模拟用户同意或拒绝，回调发生时后端仍不得收到写请求。
 * @return Promise<Client> 返回已连接的客户端，调用方结束后必须关闭。
 */
async function connect(options: {
  readonly?: boolean;
  timeoutMs?: number;
  elicitation?: 'accept' | 'decline';
  previews?: string[];
} = {}): Promise<Client> {
  const client = new Client({ name: 'skill-workflow-contract-test', version: '1.0.0' }, {
    capabilities: options.elicitation ? { elicitation: {} } : {},
  });
  if (options.elicitation) {
    client.setRequestHandler('elicitation/create', async request => {
      expect(hits.filter(hit => hit.method === 'POST')).toHaveLength(0);
      options.previews?.push((request.params as { message: string }).message);
      return options.elicitation === 'accept'
        ? { action: 'accept', content: { confirm: true } }
        : { action: 'decline' };
    });
  }
  await client.connect(new StdioClientTransport({
    command: process.execPath,
    args: ['dist/src/index.js', ...(options.readonly ? ['--readonly'] : [])],
    env: {
      ...(process.env as Record<string, string>),
      QQDL_TOKEN: 'skill-fixture-token',
      QQDL_BASE_URL: baseUrl,
      QQDL_CONFIRM_QUIET_MS: '0',
      QQDL_TIMEOUT_MS: String(options.timeoutMs ?? 5000),
    },
    stderr: 'ignore',
  }));
  return client;
}

/**
 * 读取 MCP 文本响应，遇到缺少文本的协议结果立即报错。
 *
 * @param result 工具调用返回的 MCP 结果。
 * @return string 返回第一个文本块的内容。
 */
function textOf(result: Result): string {
  const block = (result.content as { type: string; text?: string }[] | undefined)?.find(item => item.type === 'text');
  if (!block?.text) throw new Error('工具响应缺少文本内容');
  return block.text;
}

/**
 * 提取确认码供测试模拟后续同意；测试不会将时间流逝视为用户授权。
 *
 * @param result 首次写调用返回的待确认结果。
 * @return string 返回与本次工具及参数绑定的确认码。
 */
function confirmToken(result: Result): string {
  expect(result.isError).toBeFalsy();
  const token = textOf(result).match(/confirm_token=([0-9a-f]+)/)?.[1];
  expect(token, textOf(result)).toBeTruthy();
  return token!;
}

/**
 * 按参数路径逐项核对实际 PHP 表单字段，不调用生产代码中的编码函数。
 *
 * @param actual 后端收到并解码的查询串或表单。
 * @param expected Skill 示例参数及服务补齐的字段。
 * @return void 不返回业务结果；缺失、额外或错误字段会导致断言失败。
 */
function expectFields(actual: URLSearchParams, expected: Arguments): void {
  const remaining = new Map(actual.entries());
  const queue: [string, unknown][] = Object.entries(expected);
  while (queue.length) {
    const [key, value] = queue.shift()!;
    if (value === null || value === undefined) continue;
    if (typeof value === 'object') {
      queue.push(...Object.entries(value).map(([part, item]): [string, unknown] => [`${key}[${part}]`, item]));
      continue;
    }
    expect(remaining.get(key), key).toBe(String(value));
    remaining.delete(key);
  }
  expect([...remaining.entries()]).toEqual([]);
  expect([...actual.keys()]).toHaveLength(new Set(actual.keys()).size);
}

describe('Skill 示例通过真实 stdio 调用 MCP', () => {
  it('全部工具示例通过 SDK 校验，查询用 GET，写操作确认后才发送一次 POST', async () => {
    expect(cases.map(item => item.tool).sort()).toEqual(definitions.map(tool => tool.name).sort());
    const client = await connect();
    try {
      for (const example of cases) {
        activeCase = example;
        hits.length = 0;
        const tool = definitions.find(item => item.name === example.tool)!;
        const input = { name: tool.name, arguments: example.arguments };
        let result = await client.callTool(input);
        if (!tool.readOnly) {
          const token = confirmToken(result);
          expect(hits.every(hit => hit.method === 'GET'), tool.name).toBe(true);
          if (tool.name !== 'order_renew') expect(hits, tool.name).toHaveLength(0);
          result = await client.callTool({ ...input, arguments: { ...example.arguments, confirm_token: token } });
        }
        expect(result.isError, `${tool.name}: ${textOf(result)}`).toBeFalsy();
        const executed = hits.filter(hit => hit.path === tool.path && hit.method === tool.method);
        expect(executed, tool.name).toHaveLength(1);
        const hit = executed[0];
        expect(hit.token, tool.name).toBe('skill-fixture-token');
        expect(hit.userAgent, tool.name).toBe('quanqiudaili mcp');
        const expected: Arguments = { ...example.arguments, ...tool.fixed, is_mcp_send: 1 };
        if (tool.name === 'order_renew') {
          expected.sub_account_ids = [...new Set(String(expected.sub_account_ids).split(',').map(id => id.trim()).filter(Boolean))].join(',');
          expected.is_renew = 1;
          expected.renew_with_bandwidth ??= 1;
          expect(hits.filter(item => item.method === 'GET')).toHaveLength(2);
        }
        expectFields(tool.method === 'GET' ? hit.query : hit.form, expected);
        expect(tool.method === 'GET' ? [...hit.form] : [...hit.query], tool.name).toEqual([]);
        if (!tool.readOnly) expect(hit.contentType).toBe('application/x-www-form-urlencoded');
        const body = JSON.parse(textOf(result)) as Reply;
        expect(body.code, tool.name).toBe(1);
        if (example.checks && Object.hasOwn(example.checks, 'expectedData')) {
          expect(body.data, tool.name).toEqual(example.checks.expectedData);
        } else if (example.backendData !== undefined) {
          const data = tool.pick ? (example.backendData as Record<string, unknown>)?.[tool.pick] ?? null : example.backendData;
          expect(body.data, tool.name).toEqual(data);
        }
      }
    } finally {
      await client.close();
    }
  }, 60_000);

  it('只读安装保留全部查询示例与 Session 资源，写工具不可调用', async () => {
    const client = await connect({ readonly: true });
    try {
      const readOnlyTools = definitions.filter(tool => tool.readOnly);
      expect((await client.listTools()).tools.map(tool => tool.name).sort()).toEqual(readOnlyTools.map(tool => tool.name).sort());
      const resource = await client.readResource({ uri: 'quanqiudaili://docs/dynamic-proxy-session' });
      expect((resource.contents[0] as { text: string }).text).toBe(readFileSync('spec/dynamic-proxy-session.md', 'utf8'));
      const write = cases.find(example => !definitions.find(tool => tool.name === example.tool)!.readOnly)!;
      await expect(client.callTool({ name: write.tool, arguments: write.arguments })).rejects.toThrow(/not found/);
      expect(hits).toHaveLength(0);
    } finally {
      await client.close();
    }
  }, 20_000);

  it('产品 11 首购、续费、升级报价与无参单价表分别走 GET，不产生订单', async () => {
    const client = await connect({ readonly: true });
    try {
      const requests = [
        { name: 'product_unit_price', arguments: {} },
        { name: 'product_unit_price', arguments: { product_type_id: 11, country: 'US', bandwidth_num: 10, bill_timelen: 1 } },
        { name: 'product_unit_price', arguments: { product_type_id: 11, sub_account_id: '77', bill_timelen: 1 } },
        { name: 'bandwidth_upgrade_price', arguments: { product_type_id: 11, sub_account_id: '77', bandwidth_num: 20 } },
      ];
      for (const request of requests) {
        hits.length = 0;
        forcedReply = { code: 1, msg: 'ok', data: { currency: 'CNY', price: '18.00', product_type_id: 11 } };
        const result = await client.callTool(request);
        expect(result.isError, textOf(result)).toBeFalsy();
        expect(hits).toHaveLength(1);
        expect(hits[0].method).toBe('GET');
        expectFields(hits[0].query, { ...request.arguments, is_mcp_send: 1 });
        expect(JSON.parse(textOf(result)).data).toEqual(forcedReply.data);
      }
    } finally {
      await client.close();
    }
  }, 20_000);

  it('报价分支与动态流量的非法参数由 SDK 拒绝，尚未发送后端或进入确认', async () => {
    const client = await connect();
    try {
      const invalid = [
        { name: 'product_unit_price', arguments: { country: 'US', bandwidth_num: 10, bill_timelen: 1 } },
        { name: 'product_unit_price', arguments: { product_type_id: 11, country: 'US', bandwidth_num: 10 } },
        { name: 'product_unit_price', arguments: { product_type_id: 11, country: 'US', bill_timelen: 1 } },
        { name: 'product_unit_price', arguments: { product_type_id: 11, country: 'eu', bandwidth_num: 10, bill_timelen: 1 } },
        { name: 'product_unit_price', arguments: { product_type_id: 11, country: 'US', bandwidth_num: 15, bill_timelen: 1 } },
        { name: 'product_unit_price', arguments: { product_type_id: 11, sub_account_id: '77', country: 'US', bill_timelen: 1 } },
        { name: 'product_unit_price', arguments: { product_type_id: 11, sub_account_id: '77', bandwidth_num: 20, bill_timelen: 1 } },
        { name: 'bandwidth_upgrade_price', arguments: { product_type_id: 11, bandwidth_num: 20 } },
        { name: 'bandwidth_upgrade_price', arguments: { product_type_id: 11, sub_account_id: '77', sub_accounts: '77', bandwidth_num: 20 } },
        { name: 'bandwidth_upgrade_price', arguments: { product_type_id: 3, sub_account_id: '77', bandwidth_num: 20 } },
        ...[0, 5001, 1.5].map(num => ({ name: 'order_buy_dynamic', arguments: { product_type_id: 1, num } })),
        { name: 'order_buy_dynamic', arguments: { product_type_id: 6, num: 10, bill_timelen: 2 } },
      ];
      for (const request of invalid) {
        const result = await client.callTool(request);
        expect(result.isError, `${request.name} ${JSON.stringify(request.arguments)}`).toBe(true);
        expect(textOf(result)).not.toContain('confirm_token=');
      }
      expect(hits).toHaveLength(0);
    } finally {
      await client.close();
    }
  }, 20_000);

  it('混合续费设置先拒绝，按设置分组后保留各组值并分别确认', async () => {
    accountSettings = {
      '71': { is_renew: 1, renew_with_bandwidth: 1 },
      '72': { is_renew: 0, renew_with_bandwidth: 0 },
    };
    const client = await connect();
    try {
      const input = { product_type_id: 3, timelen: 0, sub_account_ids: '71,72' };
      const mixed = await client.callTool({ name: 'order_renew', arguments: input });
      expect(mixed.isError).toBe(true);
      expect(textOf(mixed)).toContain('尚未续费');
      expect(textOf(mixed)).not.toContain('confirm_token=');
      expect(hits.filter(hit => hit.method === 'POST')).toHaveLength(0);

      for (const id of ['71', '72']) {
        hits.length = 0;
        const args = { ...input, sub_account_ids: ` ${id},${id} ` };
        const preview = await client.callTool({ name: 'order_renew', arguments: args });
        const token = confirmToken(preview);
        expect(textOf(preview)).toContain(`is_renew：${accountSettings[id].is_renew}`);
        expect(hits.every(hit => hit.method === 'GET')).toBe(true);
        const result = await client.callTool({ name: 'order_renew', arguments: { ...args, confirm_token: token } });
        expect(result.isError).toBeFalsy();
        const writes = hits.filter(hit => hit.method === 'POST');
        expect(writes).toHaveLength(1);
        expectFields(writes[0].form, { ...input, sub_account_ids: id, ...accountSettings[id], is_mcp_send: 1 });
      }
    } finally {
      await client.close();
    }
  }, 20_000);

  it.each(['accept', 'decline'] as const)('弹窗回答 %s 时仅同意才发送购买请求', async answer => {
    const previews: string[] = [];
    const client = await connect({ elicitation: answer, previews });
    try {
      const result = await client.callTool({ name: 'order_buy_dynamic', arguments: { product_type_id: 1, num: 5000 } });
      expect(result.isError, textOf(result)).toBeFalsy();
      expect(previews).toHaveLength(1);
      expect(hits.filter(hit => hit.method === 'POST')).toHaveLength(answer === 'accept' ? 1 : 0);
      if (answer === 'decline') expect(textOf(result)).toContain('待确认');
    } finally {
      await client.close();
    }
  }, 20_000);

  it('确认参数变化使旧码失效，不能使用旧确认执行另一份订单', async () => {
    const client = await connect();
    try {
      const args = { product_type_id: 1, num: 10 };
      const token = confirmToken(await client.callTool({ name: 'order_buy_dynamic', arguments: args }));
      const changed = await client.callTool({ name: 'order_buy_dynamic', arguments: { ...args, num: 11, confirm_token: token } });
      expect(changed.isError).toBe(true);
      const reused = await client.callTool({ name: 'order_buy_dynamic', arguments: { ...args, confirm_token: token } });
      expect(reused.isError).toBe(true);
      expect(hits).toHaveLength(0);
    } finally {
      await client.close();
    }
  }, 20_000);

  it('业务错误返回失败，确认码已消费且没有自动重试', async () => {
    forcedReply = { code: 0, msg: '余额不足，订单未支付', data: null };
    const client = await connect();
    try {
      const args = { product_type_id: 1, num: 10 };
      const token = confirmToken(await client.callTool({ name: 'order_buy_dynamic', arguments: args }));
      const request = { name: 'order_buy_dynamic', arguments: { ...args, confirm_token: token } };
      const result = await client.callTool(request);
      expect(result.isError).toBe(true);
      expect(textOf(result)).toBe(forcedReply.msg);
      expect(hits).toHaveLength(1);
      expect((await client.callTool(request)).isError).toBe(true);
      expect(hits).toHaveLength(1);
    } finally {
      await client.close();
    }
  }, 20_000);

  it('后端已收到写请求但不返回时报告超时，不自动再下单', async () => {
    hangWrites = true;
    const client = await connect({ timeoutMs: 300 });
    try {
      const args = { product_type_id: 1, num: 10 };
      const token = confirmToken(await client.callTool({ name: 'order_buy_dynamic', arguments: args }));
      const result = await client.callTool({ name: 'order_buy_dynamic', arguments: { ...args, confirm_token: token } });
      expect(result.isError).toBe(true);
      expect(textOf(result)).toContain('未响应');
      await delay(350);
      expect(hits).toHaveLength(1);
      expect(hits[0].method).toBe('POST');
    } finally {
      await client.close();
      backend.closeAllConnections();
    }
  }, 20_000);
});
