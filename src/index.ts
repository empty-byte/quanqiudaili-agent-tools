#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { CLIENT_CAPABILITIES_META_KEY, McpServer, fromJsonSchema, type ClientCapabilities, type JsonSchemaType, type ServerContext } from '@modelcontextprotocol/server';
import { serveStdio } from '@modelcontextprotocol/server/stdio';
import { CONFIRM_TOKEN_SCHEMA, ConfirmTokens, withConfirm } from './confirm.js';
import { callApi, cfgFromEnv, type Cfg } from './http.js';
import { withRenewDefaults } from './renew.js';
import { renderSetup } from './setup.js';
import type { ToolDef } from './types.js';

const USAGE = `用法：quanqiudaili-agent-tools [--readonly] [--yes]
      quanqiudaili-agent-tools install [--agents claude-code,cursor,codex] [--scope user]
      quanqiudaili-agent-tools setup [--token 你的token] [--readonly] [--npx]
  不带参数     全部 38 个工具，含下单扣费与删除子账号；写操作执行前先向用户确认
  --readonly   只暴露 20 个只读工具
  --yes        写操作不确认直接执行，给自动化脚本用
  install      一次安装 Skills 与 MCP；install --help 查看选项，install --list 查看客户端
  setup        打印 Claude Code、Claude Desktop、Codex、Cursor、VS Code、Zed、Windsurf 的配置片段，不改任何文件；
               默认按本机安装路径生成，--npx 生成 npx -y github:empty-byte/quanqiudaili-agent-tools 的写法`;

const argv = process.argv.slice(2);

if (argv[0] === 'install') {
  const { runInstall } = await import('./install-cli.js');
  process.exit(await runInstall(argv.slice(1)));
}

if (argv[0] === 'setup') {
  const withEq = argv.find(a => a.startsWith('--token='));
  const at = argv.indexOf('--token');
  const token = withEq ? withEq.slice('--token='.length) : at >= 0 ? argv[at + 1] : undefined;
  console.log(renderSetup({ indexPath: fileURLToPath(import.meta.url), token, readonly: argv.includes('--readonly'), npx: argv.includes('--npx'), platform: process.platform }));
  process.exit(0);
}

const flags = new Set(argv);
const readonly = flags.has('--readonly') || flags.has('query');
const yes = flags.has('--yes');
for (const known of ['--readonly', 'query', 'manage', '--yes']) flags.delete(known);
if (flags.size) {
  console.error(USAGE);
  process.exit(2);
}

let cfg: Cfg;
try {
  cfg = cfgFromEnv();
} catch (e) {
  console.error(`[quanqiudaili-agent-tools] ${(e as Error).message}`);
  process.exit(2);
}

// 确认码发出后多久才能用；0 只在自动化测试里用，见 confirm.ts 里 ConfirmTokens 的说明
const confirmQuietMs = Number(process.env.QQDL_CONFIRM_QUIET_MS ?? 10_000);
if (!Number.isInteger(confirmQuietMs) || confirmQuietMs < 0) {
  console.error('[quanqiudaili-agent-tools] QQDL_CONFIRM_QUIET_MS 必须是非负整数毫秒数');
  process.exit(2);
}

// 编译后本文件在 dist/src/，包根在上两级
const read = (rel: string): string => readFileSync(new URL(rel, import.meta.url), 'utf8');
const { version } = JSON.parse(read('../../package.json')) as { version: string };
const all = JSON.parse(read('../../spec/tools.json')) as ToolDef[];
const tools = readonly ? all.filter(t => t.readOnly) : all;

const SESSION_URI = 'quanqiudaili://docs/dynamic-proxy-session';

const INSTRUCTIONS = `全球代理（quanqiudaili.com）externalapi 的 MCP 封装，直接调用后端接口，后端校验参数并返回结果。
- product_type_id：1=动态住宅流量（不限时长）、6=动态住宅流量（包月，固定30天）、2=静态住宅（普通）、3=静态住宅（原生）、4=静态住宅（运营商原生）、8=数据中心、11=动态住宅不限流量（按带宽计费）。产品 1/6 的国家、州、城市用 dynamic_* 工具查，产品 2/3/4/8 用 static_* 工具查；产品 11 的接入网关国家为 US/DE/SG，支持小写，不用国家列表查询，也不用于指定代理出口国家。
- 术语："时长类"指产品 2/3/4/8，按 IP 按天计费；"动态类"指产品 1/6，按流量计费。
- 子账号 id 按字符串传（如 "77"）；通常取 sub_account_list 返回的 id 字段，多个按参数说明用数组或英文逗号连接。产品 11 的续费和升级必须取 sub_account_id（本地 ID），列表 ids 筛选仍用 id（Go ID）；按订单操作用 order_product_buy_id。
- 产品 1/6 和 2/3/4/8 的国家用 ISO 3166-1 二字码（如 US）；分页参数 pagesize 最大 100。
- 动态流量每单为整数 1-5000 GB，按整单数量匹配 product_unit_price 无参结果中 flowPriceBoard 的产品和 min_gb/max_gb 档位，不要按旧 300GB 限制自动拆单。origin_price/custom_price 是元/GB，自定义价还受额度限制，额度不足时整单回退官网价。产品 1 不限时长；产品 6 固定 30 天，bill_timelen 可省略或传 1，到期未用流量会扣除。
- 下单、续费、带宽升级、删除类工具会从余额扣费或不可恢复：调用前用适用的库存、价格和余额工具查清情况，把参数与预计费用告诉用户并取得明确确认。
- 产品 11 使用 order_*_dynamic_bandwidth 工具，每次新购一个子账号，没有自动续费，创建后不能换网关。新购报价用 product_unit_price 传 product_type_id=11、country、bandwidth_num、bill_timelen；续费报价改传本地 sub_account_id 和 bill_timelen；升级报价用 bandwidth_upgrade_price 传 product_type_id=11、本地 sub_account_id 和目标 bandwidth_num。报价网关只接受 US/DE/SG 及小写，旧购买区域码 eu 报价前改用 DE；报价与下单须保持同一网关、带宽、周期及优惠券。realPrice 是预计总额，报价不锁价、不占库存，stock_check 不支持本产品，实际扣费以下单为准。
- 写操作工具执行前必须经用户确认：支持弹窗的客户端会弹出操作预览让用户点选；没弹窗或不支持的客户端会返回预览和 confirm_token，要把预览原样转述给用户，得到明确同意后再带 confirm_token 用相同参数调用。返回文本说"弹窗没有得到确认"时，可能是客户端没显示弹窗，也可能是用户拒绝了，同样只转述一次，用户不要就停。不要替用户做决定，用户没回答就不要带确认码重试。每一次写操作都要单独确认，同样的操作再做一次也要重新问，之前确认过不能免。确认码还有静默期，提前尝试会被拒绝并顺延可用时间；静默期只能限制调用时机，不能判断用户是否同意，时间到了也不能自行提交。
- 业务成功时返回 {code, msg, data} 的 JSON；待确认预览不是执行成功。失败时 isError 为 true，文本说明原因。写操作超时或连接中断时结果可能未知，不自动重试，应先在网站核对订单；当前没有订单查询工具。若提示 token 无效，请用户到网站 API Keys 页面核对或重新生成 API Key，并更新 QQDL_TOKEN。
- 动态住宅代理连接串的写法（cty/st/ct/ss/tm/spec 参数）见资源 ${SESSION_URI}。`;

function createServer(): McpServer {
  const server = new McpServer({ name: 'quanqiudaili-agent-tools', version }, { instructions: INSTRUCTIONS });

  const tokens = new ConfirmTokens(Date.now, confirmQuietMs);
  const listTool = all.find(t => t.name === 'sub_account_list');
  if (!listTool) throw new Error('spec/tools.json 缺少 sub_account_list');
  // 2026 版协议把客户端能力放在每个请求的信封里，2025 版放在连接初始化时
  const supportsElicitation = (ctx: ServerContext): boolean => {
    const fromEnvelope = (ctx.mcpReq.envelope as Record<string, unknown> | undefined)?.[CLIENT_CAPABILITIES_META_KEY] as ClientCapabilities | undefined;
    return !!(fromEnvelope ?? server.server.getClientCapabilities())?.elicitation;
  };

  for (const t of tools) {
    const confirm = !yes && !t.readOnly;
    const schema = confirm ? { ...t.inputSchema, properties: { ...t.inputSchema.properties, confirm_token: CONFIRM_TOKEN_SCHEMA } } : t.inputSchema;
    const exec = (args: Record<string, unknown>) => callApi(t, args, cfg);
    const base = confirm ? withConfirm(t, { supportsElicitation, exec, tokens }) : exec;
    const handler = t.name === 'order_renew' ? withRenewDefaults(base, listTool, cfg) : base;
    server.registerTool(
      t.name,
      {
        title: t.title,
        description: t.description,
        // 生成好的 JSON Schema 原样下发；SDK 用内置 Ajv 在调用前校验参数
        inputSchema: fromJsonSchema<Record<string, unknown>>(schema as JsonSchemaType),
        annotations: {
          title: t.title,
          readOnlyHint: t.readOnly,
          destructiveHint: t.destructive,
          idempotentHint: t.readOnly,
          openWorldHint: true,
        },
      },
      handler,
    );
  }

  server.registerResource(
    'dynamic-proxy-session',
    SESSION_URI,
    {
      title: '动态 IP Session 使用说明',
      description: '动态住宅代理连接串的参数规则（cty、st、ct、ss、tm、spec）、正误示例与资源池性能参考',
      mimeType: 'text/markdown',
    },
    async uri => ({ contents: [{ uri: uri.href, mimeType: 'text/markdown', text: read('../../spec/dynamic-proxy-session.md') }] }),
  );

  return server;
}

if (!readonly) {
  console.error(yes
    ? '[quanqiudaili-agent-tools] --yes：写操作不经确认直接执行。'
    : '[quanqiudaili-agent-tools] 当前包含下单扣费与删除子账号的操作工具，执行前会向用户确认；只想查询请加 --readonly。');
}
serveStdio(createServer, { onerror: e => console.error(`[quanqiudaili-agent-tools] ${e.message}`) });
