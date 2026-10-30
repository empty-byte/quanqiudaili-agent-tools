# quanqiudaili-agent-tools

全球代理（quanqiudaili.com）的 MCP 工具与业务 Skills。支持一次安装到多种 AI 编程 Agent，用自然语言查询子账号、库存、价格与余额，并在确认后完成下单、续费与子账号管理。一个 Skill 按五类工作流覆盖全部 38 个工具；MCP 执行参数校验、接口调用和写操作确认。

仓库地址为 [empty-byte/quanqiudaili-agent-tools](https://github.com/empty-byte/quanqiudaili-agent-tools)。npm 包名、可执行命令与 MCP 握手服务标识统一为 `quanqiudaili-agent-tools`；客户端配置名和业务 Skill 名为 `quanqiudaili`。

各客户端的配置步骤、操作示例与常见问题见 [使用指南](USAGE.md)；需求分析、实施记录与阅读顺序见 [文档索引](docs/README.md)。

- 只读模式 `--readonly` 仅暴露 20 个查询工具，不会产生任何费用。
- 下单、续费、删除等 18 个写操作默认启用确认流程，执行前需由用户核对预览并明确同意。
- 参数定义由接口文档和本地修正生成，不符合工具 schema 的参数会在本地被拒绝；业务规则仍由后端校验。

业务逻辑、鉴权与扣费均由后端完成。MCP 层负责 HTTP 调用，Skill 组织流程，安装器负责本地客户端配置。

## 环境要求

- Node.js 20 或更新版本，Windows、macOS、Linux 均可。
- 从 GitHub 克隆源码或使用 npx 方式接入时，本机需安装 `git`，并能访问 GitHub 和 npm 依赖源。

## 快速开始

### 1. 获取 API Key

登录 quanqiudaili.com，点击右上角头像进入 API Keys，新建一个 Key 并复制完整字符串（形如 `sk-…`）。Key 不按时间自动过期，但可以在网站删除使其失效；实际操作仍受账号权限和后端规则限制。请勿泄露或写入代码。

### 2. 一次安装 Skills 与 MCP（推荐）

**`QQDL_TOKEN`（网站 API Key）是安装和使用 MCP 的必填项，只读模式也需要。** 以下命令采用交互安装：未通过环境变量提供 Key 时，安装器会提示隐藏输入，留空不能完成安装；输入后会自动保存到所选客户端的 `QQDL_TOKEN` 配置。

首次安装时，在准备存放源码的位置打开终端，先从 GitHub 下载项目，再进入项目目录安装：

```bash
git clone https://github.com/empty-byte/quanqiudaili-agent-tools.git
cd quanqiudaili-agent-tools
npm ci
# 接下来按提示选择客户端，并输入 QQDL_TOKEN（API Key，必填）。
node dist/src/index.js install
```

`git clone` 下载源码，`cd` 进入包含 `package.json` 的项目根目录；`npm ci` 安装依赖并自动构建，最后一条命令才会安装 Skills 和 MCP。已经下载源码的用户进入该目录后执行最后两条即可。

交互选择一个或多个 Agent，输入 API Key，即可同时安装技能和 MCP 配置。默认安装到当前用户，后续项目可直接使用。也可以指定目标：

```bash
node dist/src/index.js install --agents claude-code,cursor,codex,gemini-cli,opencode --scope user
```

支持 Claude Code、Cursor、Codex、Gemini CLI、OpenCode、GitHub Copilot CLI、VS Code、Windsurf、Kiro CLI、Zed、Cline 共 11 种 Agent。用 `install --list` 查看名称和安装范围。

**另一种方式：由 npx 自动下载并运行安装器。** 无需手动克隆项目或另外执行 `npm ci`，在终端运行：

```bash
# 同样会提示输入 QQDL_TOKEN（API Key，必填）。
npx -y github:empty-byte/quanqiudaili-agent-tools install
```

npx 会下载项目、安装依赖并构建，再启动同一个交互安装入口。两种方式任选其一。下载的版本须包含 `install` 子命令；旧版本不识别时，请更新版本，或使用包含安装功能的源码按前面的完整步骤安装。

自动化环境无法交互输入时，必须通过安装进程的 `QQDL_TOKEN` 环境变量或 `--token-stdin` 提供 Key，否则安装失败。仅查看帮助、客户端列表、`--dry-run` 预览或 `setup` 模板时不需要真实 Key，这些操作不会完成安装或启动业务服务。

安装器合并本项目配置，保留其他服务；遇到已有不同的同名配置或用户修改过的技能时停止，可用 `--dry-run` 预览，确定替换时加 `--replace`。重复安装用于更新，`setup` 仍然只输出配置。运行包保存在用户目录的 `.quanqiudaili-agent-tools/versions/`，启动不依赖 npx 缓存。安装只配置文件，不自动请求线上业务；完成后重新加载客户端并启用服务。

安装与客户端凭据处理、范围限制见 [使用指南](USAGE.md#一次安装-skills-与-mcp)。

### 3. 仅接入 MCP（手动配置）

本节与第 2 步的一体安装二选一。已完成 Skills 与 MCP 一体安装的用户，直接跳到第 4 步验证，不必再次添加同名服务。只需要 MCP 时，从下面两种方式中任选其一。

**方式一：npx 启动 MCP**

在客户端配置中把启动命令写成 `npx -y github:empty-byte/quanqiudaili-agent-tools`。首次拉起时由 npm 下载、编译并缓存，耗时取决于网络与本机环境；实际功能以下载到的版本为准。

打印所有客户端的配置片段（只输出文本，不修改任何文件）：

```bash
npx -y github:empty-byte/quanqiudaili-agent-tools setup --npx
```

Claude Code：

```bash
claude mcp add -s user -e QQDL_TOKEN=<API Key> quanqiudaili -- npx -y github:empty-byte/quanqiudaili-agent-tools
```

Claude Desktop，写入 `claude_desktop_config.json`（Windows：`%APPDATA%\Claude\`；macOS：`~/Library/Application Support/Claude/`）：

```json
{
  "mcpServers": {
    "quanqiudaili": {
      "command": "npx",
      "args": ["-y", "github:empty-byte/quanqiudaili-agent-tools"],
      "env": { "QQDL_TOKEN": "<API Key>" }
    }
  }
}
```

Windows 下若客户端提示找不到 `npx`，将 `command` 改为 `cmd`，并在 `args` 最前面加入 `"/c", "npx"`。

**方式二：本地安装**

```bash
git clone https://github.com/empty-byte/quanqiudaili-agent-tools.git
cd quanqiudaili-agent-tools
npm ci
```

`npm ci` 会自动编译到 `dist/`。启动命令为 `node <安装目录>/dist/src/index.js`，打印配置片段：

```bash
node <安装目录>/dist/src/index.js setup --token <API Key>
```

Claude Code（`<安装目录>` 为绝对路径，Windows 也使用正斜杠，如 `C:/tools/quanqiudaili-agent-tools`）：

```bash
claude mcp add -s user -e QQDL_TOKEN=<API Key> quanqiudaili -- node <安装目录>/dist/src/index.js
```

Claude Desktop：

```json
{
  "mcpServers": {
    "quanqiudaili": {
      "command": "node",
      "args": ["<安装目录>/dist/src/index.js"],
      "env": { "QQDL_TOKEN": "<API Key>" }
    }
  }
}
```

更新：在安装目录执行 `git pull && npm ci`。

### 4. 验证

重启客户端后，向 AI 提问"我的账户余额是多少"，能返回金额即接入成功。Claude Code 中可用 `/mcp` 查看连接状态。

## 配置

`setup` 子命令的输出按客户端分段，包含 Claude Code、Codex CLI、Claude Desktop、Cursor、Windsurf、VS Code、Zed 的配置，以及适用于任何 stdio 客户端的标准 `mcpServers` JSON。加 `--readonly` 可生成只读版配置。

启动参数：

| 参数 | 说明 |
|---|---|
| 无 | 暴露全部 38 个工具 |
| `--readonly` | 仅暴露 20 个只读工具 |
| `--yes` | 写操作不再确认，仅供自动化脚本使用 |

环境变量：

| 变量 | 必填 | 默认值 | 说明 |
|---|---|---|---|
| `QQDL_TOKEN` | 是 | 无 | API Key |
| `QQDL_BASE_URL` | 否 | `https://admin.quanqiudaili.com` | 接口地址 |
| `QQDL_TIMEOUT_MS` | 否 | `30000` | 单次请求超时（毫秒） |
| `QQDL_CONFIRM_QUIET_MS` | 否 | `10000` | 确认码生效前的静默期（毫秒） |

建议把环境变量写在客户端 MCP 配置的 `env` 中；图形客户端和不同启动方式不一定继承当前终端的环境。直接从终端启动服务时，也可由该进程继承 `QQDL_TOKEN`。一体安装会把提供的 Key 写入所选客户端配置。提示“token 无效”时，先核对 Key 是否完整、是否已被删除以及账号状态，必要时在网站新建 Key，更新配置后重新连接。

## 写操作确认

默认配置下，写操作工具在执行前会先提示确认：

- 客户端支持 MCP 弹窗确认（elicitation）时，弹出操作预览，用户确认后才请求后端。
- 客户端不支持弹窗，或弹窗未获确认时，工具只返回操作预览和一个一次性确认码，由 AI 转述给用户；用户明确同意后，AI 才应携带确认码以相同参数再次调用，用户拒绝时停止调用。确认码 5 分钟内有效，默认发出后 10 秒内不能使用，提前使用会被拒绝并顺延生效时间；等待期用于限制连续重试，每次操作仍须取得用户明确同意。
- 每次操作均需单独确认，参数变化或再次执行同样的操作都会重新确认。
- 该确认与客户端自身的工具权限提示相互独立，可能出现两次询问。

## 工具清单

产品类型 `product_type_id`：1 动态住宅流量（不限时长）、6 动态住宅流量（包月）、2 静态住宅（普通）、3 静态住宅（原生）、4 静态住宅（运营商原生）、8 数据中心、11 动态住宅不限流量（按带宽计费）。国家使用 ISO 3166-1 二字码，如 `US`；产品 11 的 `country` 指接入网关国家：`US`（美国）、`DE`（德国）、`SG`（新加坡），支持小写国家码。购买接口保留旧区域码 `eu`，报价时需转换成 `DE`。该参数不用于指定代理出口国家，购买后不能更换。

产品 11 每次新购一个子账号，不支持自动续费。续费和升级使用 `sub_account_list` 返回的本地 `sub_account_id`；列表的 `ids` 筛选使用 `id`（Go ID），退单使用整数 `order_product_buy_id`（首个新购订单 ID）。`product_unit_price` 支持产品 11 新购/续费报价，`bandwidth_upgrade_price` 支持升级报价；`stock_check` 不提供该产品库存。报价不锁价，实际扣费以后端为准。

动态流量产品 1/6 每单为 1–5000 GB，按整单数量匹配阶梯价格；产品 6 固定 30 天。`product_unit_price` 不传参数仍返回原产品单价表与 `flowPriceBoard`，不要按旧 300 GB 规则自动拆单。

只读工具（`--readonly` 模式暴露的全部工具）：

| 工具 | 说明 |
|---|---|
| user_info | 账号信息 |
| user_balance | 账户余额 |
| product_list | 产品列表 |
| product_unit_price | 无参查询产品单价及动态阶梯价；传产品 11 参数试算新购或续费 |
| dynamic_country_list / dynamic_state_list / dynamic_city_list | 动态产品（1、6）的国家、州、城市 |
| static_country_list / static_city_list | 时长产品（2、3、4、8）的国家、城市 |
| static_region_stock | 时长产品地区库存 |
| static_ip_range_list | 时长产品 IP 段 |
| stock_check | 下单前库存检测 |
| sub_account_list | 子账号列表，覆盖全部产品 |
| sub_account_flow_query | 动态子账号月度流量 |
| sub_account_limit_flow | 子账号流量上限及定时记录的已用量快照；不是实时流量 |
| bandwidth_package_list / bandwidth_monitoring_list / bandwidth_trend / bandwidth_detail | 带宽套餐、监控、趋势、详情 |
| bandwidth_upgrade_price | 普通时长产品及产品 11 的带宽升级价格试算 |

写操作工具（默认模式暴露）：

| 工具 | 说明 |
|---|---|
| sub_account_add | 新增动态子账号 |
| sub_account_update / sub_account_update_batch | 修改子账号备注 |
| sub_account_set_credentials | 设置子账号自定义账密 |
| sub_account_toggle_direct | 批量开关直连 |
| sub_account_set_limit_flow | 设置永久或按天、周、月、自然季度、年的流量上限 |
| sub_account_delete / sub_account_delete_batch | 删除动态流量子账号，不可恢复 |
| order_buy_dynamic | 购买动态住宅流量（产品 1、6），扣费 |
| order_buy_time_ip | 购买时长 IP（产品 2、3、4、8），扣费 |
| order_buy_dynamic_bandwidth | 购买动态住宅不限流量（产品 11），扣费 |
| order_buy_test_ip | 购买时长测试 IP，扣费 |
| order_renew | 续费时长 IP，扣费；保留自动续费开关，本次时长会用于后续自动续费；带宽续费选项未传时沿用当前值，传入时同时更新该设置 |
| order_renew_dynamic_bandwidth | 续费动态住宅不限流量，扣费；保持当前带宽 |
| order_bandwidth_upgrade | 带宽升级下单，余额支付 |
| order_upgrade_dynamic_bandwidth | 升级动态住宅不限流量带宽，扣费；到期时间不变 |
| order_refund_apply | 申请退单 |
| order_refund_dynamic_bandwidth | 申请动态住宅不限流量退单；审核通过后删除并终止子账号，不可恢复 |

资源 `quanqiudaili://docs/dynamic-proxy-session`：动态住宅代理连接串的参数说明与示例。

## 调试

使用官方 Inspector 直接查看工具列表或手动调用，API Key 通过 `-e` 传入：

```bash
npx @modelcontextprotocol/inspector -e QQDL_TOKEN=<API Key> -- node <安装目录>/dist/src/index.js
```

## 开发与维护

```bash
npm test             # 构建并运行全部测试，不联网
npm run build-skills # 从 Session 规范同步技能内的生成副本
npm run sync-docs    # 从文档站重新生成工具定义，并打印与上一版的差异
npm run build-spec   # 仅用本地已下载的文档页重新生成工具定义
```

接口页通过[文档索引](https://develop.quanqiudaili.com/llms.txt)同步，再结合 `spec/overrides.yaml` 生成工具定义；不要手改 `spec/tools.json`。工具名、描述与文档修正维护在 overrides。涉及在后端创建数据的操作不做线上自动化联调，由维护者用测试账号手动验证。

业务技能位于 `skills/quanqiudaili/`，工具归属表确保 38 个工具无遗漏；本地假后端测试通过真实 stdio 调用全部工具，安装测试使用隔离目录与合成凭据。客户端格式适配复用固定版本的 [add-mcp](https://github.com/neon-solutions/add-mcp)，安装目录布局参考 [Agent Skills 客户端说明](https://github.com/vercel-labs/skills/blob/main/docs/agents.md)。测试不等同于所有客户端 GUI、线上部署或模型自由任务已验收。

## 许可

MIT，见 `LICENSE`。
