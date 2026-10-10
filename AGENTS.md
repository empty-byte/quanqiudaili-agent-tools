# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## 项目是什么

全球代理（quanqiudaili.com）对外 HTTP 接口 `externalapi` 的 MCP 服务器。TypeScript，官方 MCP SDK v2（`@modelcontextprotocol/server` 2.x），仅 stdio。不带参数暴露全部 38 个工具（含下单扣费与删除），`--readonly` 只暴露 20 个只读工具，旧参数 `query`/`manage` 仍接受；18 个写操作工具执行前先向用户确认（`src/confirm.ts`），`--yes` 关闭确认；`setup` 子命令打印各客户端的配置片段，不写文件。参数业务校验、鉴权、扣费都在 PHP 后端，本项目只是 HTTP 客户端，不改后端。面向其他使用者，环境要求与命令示例不以某台开发机为准。

## 常用命令

- `npm ci`：安装并自动构建（`prepare` 跑 `tsc`，输出到 `dist/`）。
- `npm test`：构建 + 全部测试。不联网，端到端测试起本地假后端。
- `npx vitest run test/http.test.ts`：跑单个测试文件；`npx vitest run test/spec.test.ts -u` 更新快照。
- `npm run build-spec`：用本地 `spec/pages/` 重新生成 `spec/tools.json`，不联网。
- `npm run sync-docs`：联网重新下载文档站全部接口页到 `spec/pages/`，随后自动 build-spec 并打印与上一版的差异。
- 运行：`node dist/src/index.js [--readonly] [--yes]`。环境变量 `QQDL_TOKEN`（必填）、`QQDL_BASE_URL`（默认线上）、`QQDL_TIMEOUT_MS`、`QQDL_CONFIRM_QUIET_MS`（确认码静默期，默认 10000，端到端测试设 0）。
- 配置片段：`node dist/src/index.js setup --token xxx [--readonly] [--npx]`，打印 Claude Code、Claude Desktop、Codex、Cursor、VS Code、Zed、Windsurf 的配置，生成逻辑在 `src/setup.ts`（纯文本函数，有单测）。默认按本机路径生成 `node …/dist/src/index.js`，`--npx` 生成 `npx -y github:empty-byte/quanqiudaili-mcp`（从 GitHub 拉起）。
- 发布：目前从 GitHub 分发，使用者 `npx -y github:…` 时 npm 会克隆仓库、装依赖、跑 `prepare` 构建，再按 `files` 白名单（`dist/src`、`spec/tools.json`、`spec/dynamic-proxy-session.md`）打包，所以使用者机器要有 `git`。运行期从 `dist/src/index.js` 往上两级找包根，本地安装与打包后的安装布局一致。
- 调试：`npx @modelcontextprotocol/inspector -e QQDL_TOKEN=xxx -- node dist/src/index.js`。客户端拉起子进程时不继承终端环境变量，token 只能通过客户端配置或 Inspector 的 `-e` 传入。

## 架构：两条链路

开发期（生成链路）：文档站 `llms.txt` → `scripts/sync-docs.ts` 下载 85 个接口页（每页一个 OpenAPI 3.0.1 YAML 块），按文档站左侧分组存成 `spec/pages/<分组英文名>/<控制器>-<方法>.md`（映射表 `TAG_DIR`，产品分组带 `product_type_id` 前缀，如 `2-static-standard/device-accountList.md`；产品 11 存在 `11-dynamic-bandwidth/`），同一分组同一接口有多页时文件名带 Apifox 页面 id → `scripts/lib/merge.ts` 按接口路径合并变体页、应用 `spec/overrides.yaml` → `scripts/build-spec.ts` 写出 `spec/tools.json`。原始页和生成物都提交入库，`spec/pages/` 同时是快照测试的输入；目录与文件名由 `placePages()` 决定，不要手动改名，`test/spec.test.ts` 会校验。

运行期：`src/index.ts` 只读 `spec/tools.json`，用 `fromJsonSchema()` 把每个工具的 JSON Schema 原样注册给 SDK，SDK 用内置 Ajv 在调用前校验（所有对象都 `additionalProperties: false`，写错参数名会被拒绝而不是发给后端）。`src/http.ts` 把参数经 `src/form.ts` 编成 `application/x-www-form-urlencoded`（PHP 括号格式 `content[0][id]=…`），只读工具 GET、其余 POST，每个请求都附带参数 `is_mcp_send=1` 和请求头 `User-Agent: quanqiudaili mcp` 供后端识别 MCP 流量，再把后端 `{code,msg,time,data}` 映射成 MCP 结果。`--readonly` 就是按 `readOnly` 过滤同一份工具表。运行期不 import zod、不解析 YAML、不联网拉文档。

写操作确认（`src/confirm.ts`）：非只读工具的处理器由 `withConfirm` 包装。支持 elicitation 的客户端通过弹窗确认；未获得弹窗同意或不支持弹窗时，返回预览和一次性 `confirm_token`。调用方必须先展示预览并取得用户明确同意，再携带确认码调用；用户拒绝时停止调用。确认码绑定工具与参数，5 分钟有效，默认静默期 10 秒，提前使用会被拒绝并顺延生效时间。写工具注册时增加可选 `confirm_token`，`spec/tools.json` 不包含它。`preview()` 根据工具标题、描述首句和参数生成预览，不自动查询价格或余额。

续费设置（`src/renew.ts`）：`order_renew` 由 `withRenewDefaults` 在确认前查询子账号当前设置，保留 `is_renew`；`renew_with_bandwidth` 未传时沿用当前值。需沿用的设置在子账号之间不一致时，要求分开续费。`sub_account_ids` 发送前去空格、去重，预览展示补齐后的实际参数。本次续费时长会用于后续自动续费，修改时须保留这一使用提示。

## 改工具定义的正确姿势

不要手改 `spec/tools.json`。工具名、中文描述、只读与破坏性标注、按产品拆分、参数类型/描述/枚举/必填的修正都在 `spec/overrides.yaml`，按接口路径做 key；改完 `npm run build-spec`，再 `npm test`，快照变化合理就 `-u`。`test/spec.test.ts` 会校验 `tools.json` 与当前生成结果一致，忘了重生成会红。同一接口只取 data 里一个字段的派生工具（如 `user_balance` 取 `user_info` 的 `money`）写在 overrides 顶层 `derived`，生成时从来源工具复制并带上 `pick`，运行期 `callApi` 只返回该字段。

合并规则要点：同路径各页参数取并集；顶层参数要在全部变体页都必填才必填，部分必填写进描述；`product_type_id` 强制 integer，枚举取各页“此处固定为 N”；`name[0][key]` 转对象数组，`name[]` 转数组；描述去掉 HTML 标签。`split` 可按 `productTypeIds` 或文档 `tags` 拆分；产品 11 的新购与退单按分组拆分，避免与时长产品的参数混合。文档站新增接口会让生成失败并列出路径，把它加进 overrides 或 `ignore`。文档缺陷的兜底条目在 overrides 中注明参数差异和移除条件，文档站修好后删除。

## 接口约定

- token 是网站 API Keys 页面生成的 API Key（永久有效），放请求头 `token`。登录、登出、token 检测与刷新接口已下线。成功 `{code:1,…}`；业务错误 HTTP 200 `{code:0,msg}`；未登录 HTTP 401 `{code:401,msg:"请先登录"}`；限流 `{code:0,msg:"访问频繁,请稍后再试!"}`，每接口每 IP 每分钟 180 次。
- 只读工具统一使用 GET；`common/countryList`、`stateList`、`cityList` 的参数必须放在查询串中。
- `product_type_id`：1 动态住宅流量不限时长、6 动态住宅流量包月、2 静态住宅普通、3 静态住宅原生、4 静态住宅运营商原生、8 数据中心、11 动态住宅不限流量（按带宽计费）。
- 产品 11 用 `order_buy_dynamic_bandwidth`、`order_renew_dynamic_bandwidth`、`order_upgrade_dynamic_bandwidth`、`order_refund_dynamic_bandwidth`。每次新购一个子账号，无自动续费；`country` 使用接入网关国家码 `US`/`DE`/`SG`，支持小写 `us`/`de`/`sg`，保留旧区域码 `eu`（对应 `DE`）；创建后不能更换，也不用于指定代理出口国家。现有库存及价格工具不提供产品 11 的库存或报价，实际扣费以后端计算为准。退单审核通过后删除并终止子账号，不可恢复。
- 周期限流 `timelen=3` 为自然季度，从当年 1/4/7/10 月的 1 日开始统计和重置；`type=0` 的永久限流忽略周期。
- `createBandwidthUpgradeOrder` 的 `pay_method` 固定 `balance`，用 overrides 的 `fixed` 加 `drop` 实现。
- `createProductBuyOrder` 的 `num` 对原有产品都是 1-300（动态流量按 GB），数据中心单次最多 50；产品 11 每单固定一个子账号，不暴露 `num`。数据中心不支持购买或续费 7 天，工具描述中须保留这一限制。
- 子账号 id 类参数一律 string（数组元素也是），`test/spec.test.ts` 有断言；产品 11 列表的 `id` 是 Go ID（用于 `ids` 筛选），续费、升级必须取本地 `sub_account_id`；退单取首个新购订单的 `order_product_buy_id`，保持 integer。

## 规则

- stdout 是 MCP 协议通道，日志只用 `console.error`。token 不进日志、不进返回给模型的错误文本。
- 写操作的确认层不能绕过：新增写工具自动带确认；测试里要直接打假后端就连 `--yes` 或在客户端声明 elicitation 并自动同意。
- 自动化测试不打线上。新增子账号、下单、续费、退单、删除等会在后端创建或删除数据的操作，只由维护者用测试账号手动验证，Codex 不代跑；只读工具和 `sub_account_update` 改备注可以联调。
- 注释只写后来者不查资料就能懂的"为什么"，不复述库函数行为、协议版本或 SDK 内部术语；仓库没有 eslint，不写 eslint 指令。

## 文档

- [README.md](README.md)：安装、配置、工具清单与开发命令。
- [USAGE.md](USAGE.md)：面向使用者的客户端接入与操作说明。
