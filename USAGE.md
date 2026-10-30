# 全球代理 Skills 与 MCP 使用指南

全球代理 MCP 可以把你的全球代理账号接入 AI 客户端；配套 Skill 指导 AI 按产品规则完成查询、选购、续费和管理流程。配置完成后，用自然语言查询余额、产品、子账号、库存和价格，也可以在确认后购买、续费或管理子账号。

本指南适用于动态住宅流量（不限时长、包月）、静态住宅（普通、原生、运营商原生）、数据中心，以及按带宽计费的动态住宅不限流量。所有产品使用同一份接入配置，具体功能取决于产品规则、账号权限和当前发布版本。

- 全球代理网站：[quanqiudaili.com](https://www.quanqiudaili.com/)
- 项目地址：[quanqiudaili-agent-tools](https://github.com/empty-byte/quanqiudaili-agent-tools)

项目、仓库、npm 包名、可执行命令及 MCP 握手服务标识统一为 `quanqiudaili-agent-tools`。客户端配置名和业务 Skill 名为 `quanqiudaili`。

## 1. 使用前准备

准备以下环境：

1. 一个全球代理账号，以及在网站 **API Keys** 页面创建的 API Key。
2. 一个支持本地 MCP 服务的 AI 客户端，例如 Claude Desktop、Claude Code、Codex、Cursor 或 VS Code 的 Copilot Agent。
3. [Node.js 20 或更新版本](https://nodejs.org/en/download)，安装后应能使用 `node`、`npm` 和 `npx`。
4. [Git](https://git-scm.com/downloads)，并确保电脑能访问 GitHub。

可以在终端检查是否安装成功：

```bash
node --version
npm --version
git --version
```

本服务由 AI 客户端在你的电脑上启动，连接类型选择 **stdio / 本地命令**。它不提供可直接填写的远程 MCP HTTP 地址。

## 2. 获取 API Key

登录全球代理网站，进入 **API Keys** 页面，新建并复制一个 API Key。获取方式见[官方说明](https://develop.quanqiudaili.com/9518262m0)。

将下面示例中的 `YOUR_API_KEY` 替换为自己的 Key。建议填入客户端 MCP 配置的 `QQDL_TOKEN`，不要把网站登录密码交给 AI。客户端是否继承终端环境取决于启动方式，不能只在另一个终端设置变量就假定图形客户端能读取。

API Key 用于访问你的账号，包含已授权的查询和管理能力。请保存在本机配置中，不要把真实 Key 放进公开网页、代码仓库或共享截图。

## 3. 接入 AI 客户端

### 一次安装 Skills 与 MCP

**`QQDL_TOKEN` 就是前面取得的网站 API Key，正式安装和运行 MCP 时必填，`--readonly` 也不例外。** 下面的命令采用交互安装，因此没有把 Key 写在命令行中：未预先提供 Key 时，安装器会提示输入，输入内容直接可见，便于核对；留空无法继续。

**方式一：先从 GitHub 下载源码，再本地安装。** 首次使用时，在准备存放项目的位置打开终端，依次执行：

```bash
git clone https://github.com/empty-byte/quanqiudaili-agent-tools.git
cd quanqiudaili-agent-tools
npm ci
# 按提示选择客户端，并输入 QQDL_TOKEN（API Key，必填）。
node dist/src/index.js install
```

第一条命令下载仓库，第二条进入项目根目录；`npm ci` 必须在包含 `package.json` 和 `package-lock.json` 的目录执行，会安装依赖并自动构建 `dist/`。最后一条命令安装 Skills 与 MCP。已有源码时，先进入该目录，再执行最后两条命令，不必重复克隆。

**方式二：由 npx 自动下载并运行安装器。** 如果不需要自己管理源码目录，在终端直接执行：

```bash
# 同样会提示输入 QQDL_TOKEN（API Key，必填）。
npx -y github:empty-byte/quanqiudaili-agent-tools install
```

npx 会下载项目、安装依赖并构建，然后启动安装器；此方式无需另行执行 `git clone` 或 `npm ci`。两种方式任选其一，均需要前面列出的 Node.js、Git 和网络环境。下载版本须包含 `install` 子命令；旧版本不识别时，请更新版本或使用包含安装功能的源码按方式一安装。

按提示选择一个或多个客户端、安装范围并输入 API Key。安装器先调用只读用户信息接口 `GET /externalapi/user/getUserInfo` 验证 Key，验证通过后才复制 Skill、部署本地 MCP 运行时并写入客户端配置。Key 保存到所选客户端 `quanqiudaili` 服务的启动环境中，以后启动 MCP 时自动传入 `QQDL_TOKEN`。若已通过环境变量或 `--token-stdin` 提供 Key，同样执行验证，无需再次交互输入。默认使用用户级安装；交互界面也可选择当前项目。安装期间不执行购买、续费、删除等写操作。

验证进度与结果仅显示 Key 首尾各 4 个字符，中间以星号代替；短 Key 全部遮罩。交互输入错误时会显示验证失败原因，可重新输入或取消，错误的 Key 不会写入配置。环境变量或标准输入提供的 Key 验证失败时，安装器以非零退出码结束，修改凭据后重新运行命令即可。网络连接失败、超时或后端异常时也会阻止安装，不能跳过验证。

首次接入通常选择用户级安装。如果选择项目级，目标就是执行命令时的当前目录；刚克隆后选择项目级会安装到本工具仓库。需要装到自己的业务项目时，先进入那个项目，再使用 npx 命令或源码安装入口的绝对路径，详见下方 `--scope project` 说明。

使用方式一时，在源码目录可以指定同时安装到 Claude Code、Cursor 和 Codex：

```bash
node dist/src/index.js install --agents claude-code,cursor,codex --scope user
```

使用方式二时，将相同选项接在 npx 命令后，例如：

```bash
npx -y github:empty-byte/quanqiudaili-agent-tools install --agents claude-code,cursor,codex --scope user
```

源码方式可以这样预览目标路径，或仅安装查询模式；npx 方式同样在安装命令后追加这些选项：

```bash
node dist/src/index.js install --agents claude-code,cursor,codex --scope user --dry-run
node dist/src/index.js install --agents claude-code,cursor,codex --scope user --readonly
```

当前提供以下 11 个客户端的安装适配。安装成功表示 Key 已通过用户信息接口验证并完成文件配置；客户端是否加载技能、启用 MCP，仍取决于其版本与设置，需要重新加载客户端后验证连接。

| 客户端 | `--agents` 名称 | 安装范围 |
|---|---|---|
| Claude Code | `claude-code` | 用户级、项目级。 |
| Cursor | `cursor` | 用户级、项目级。 |
| Codex | `codex` | 用户级、项目级。 |
| Gemini CLI | `gemini-cli` | 用户级、项目级。 |
| OpenCode | `opencode` | 用户级、项目级。 |
| GitHub Copilot CLI | `github-copilot-cli` | 用户级、项目级。 |
| VS Code / Copilot | `vscode` | 用户级、项目级。 |
| Windsurf | `windsurf` | 仅用户级。 |
| Kiro CLI | `kiro-cli` | 用户级、项目级。 |
| Zed | `zed` | 用户级、项目级。 |
| Cline | `cline` | 仅用户级。 |

`--scope project` 将技能和 MCP 配置写到**执行命令时所在的项目**。在其他项目中安装时，请用安装入口的绝对路径运行，例如 `node "/你的源码目录/dist/src/index.js" install --agents cursor --scope project`，不要把示例路径原样复制。Claude Code 与 GitHub Copilot CLI 的项目级配置共用同名槽位，但格式不同；同时使用两者时分别采用用户级安装，安装器会拒绝有冲突的项目级组合。Windsurf 和 Cline 使用 `--scope user`。

| 选项 | 用途 |
|---|---|
| `--agents codex,cursor` | 指定客户端，可用逗号或重复 `--agents`；省略时交互选择。 |
| `--scope user` / `--scope project` | 用户级或当前项目级；非交互时默认用户级。 |
| `--readonly` | 安装为仅查询模式，开放 20 个只读工具。 |
| `--dry-run` | 只检查并显示安装目标，不写文件、不连接后端、不要求 API Key；已有冲突仍会报错。 |
| `--replace` | 明确替换所选客户端中冲突的同名服务或技能文件；其他服务保持原值。 |
| `--list` | 列出当前支持的客户端与安装范围，不执行安装。 |
| `--token-stdin` | 从标准输入读取 API Key，适合从本机秘密管理工具或安全输入管道提供。 |
| `--help` | 查看安装命令帮助。 |

API Key 可以通过交互式可见输入、安装进程的 `QQDL_TOKEN` 环境变量或 `--token-stdin` 提供。非交互安装必须指定 `--agents` 并提供 Key；指定 `--token-stdin` 时优先使用标准输入。三种来源都必须通过同一个用户信息接口验证。安装器不提供 `--token` 命令行参数，避免把 Key 写进命令历史；也不要把真实 Key 直接写在管道示例或脚本中。

默认验证地址为 `https://admin.quanqiudaili.com`，请求超时为 30000 毫秒。安装进程指定了 `QQDL_BASE_URL` 或 `QQDL_TIMEOUT_MS` 时，验证使用这些值，并把相应配置写入所选客户端，保证安装验证与后续 MCP 请求一致。仅查看 `--help`、`--list`、`--dry-run` 或 `setup` 模板时不要求 Key，也不请求后端。

API Key **以明文保存在所选客户端的本地配置中**，不会写进 Skill。修改已有文件前，安装器保存同目录的 `.qqdl-backup-…` 原文备份，备份也可能包含 Key。项目级 MCP 配置及这些备份不要提交到代码仓库或分享；安装器不会自动修改项目的忽略规则。

JSON/JSONC 配置按节点更新，保留其他节点及其注释；Codex 等使用的 TOML 配置会保留其他设置的值，但变更时会重新排版、移除注释，原文可从备份查看。已有同名服务或技能被手工改过时，默认停止并保留原文件；确认要用本项目版本替换后再加 `--replace`。

MCP 运行时保存在用户目录的 `~/.quanqiudaili-agent-tools/versions/` 下，客户端使用其中的稳定路径，不依赖 `npx` 临时缓存目录或源码目录。安装所用的 Node.js 仍需保留；迁移 Node.js 路径后重新安装即可更新配置。

安装完成后重新加载所选客户端，按客户端提示信任项目、启用技能与 MCP，并授权使用相应工具。安装器不会自动批准这些权限，也不会关闭写操作确认。随后按第 4 节查询余额验证连接。

更新时取得新版源码，运行 `npm ci`，再用相同客户端和范围重复执行 `install`。未被手工修改的受管配置和技能会更新；相同内容不会重复改写。更新时继续明确传入需要的 `--readonly`，省略它会安装默认的全部工具模式。当前没有卸载命令，也不会自动清理旧版本运行目录或旧备份。

### 手动配置 MCP

以下方式适合只使用 MCP 或自行管理配置的用户，不会安装配套 Skill。已完成上一节一体安装时，无需再添加同名服务。可用功能以实际下载的版本为准：

```bash
npx -y github:empty-byte/quanqiudaili-agent-tools
```

**这条命令要配置在 AI 客户端中，由客户端启动服务。** 首次启动会下载依赖并编译，所需时间取决于网络。如果直接在终端运行后停在等待状态，并不代表连接失败；服务正在等待客户端通信。

从下面选择自己使用的客户端。已有配置时，只添加 `quanqiudaili` 这一项，保留其他服务器配置。

### Claude Desktop

在设置的 Developer 页面点击 **Edit Config**，打开 `claude_desktop_config.json`，加入以下配置。配置入口和文件位置见[本地 MCP 接入说明](https://modelcontextprotocol.io/docs/develop/connect-local-servers)。

```json
{
  "mcpServers": {
    "quanqiudaili": {
      "command": "npx",
      "args": ["-y", "github:empty-byte/quanqiudaili-agent-tools"],
      "env": {
        "QQDL_TOKEN": "YOUR_API_KEY"
      }
    }
  }
}
```

保存后完全退出并重新打开 Claude Desktop。

### Cursor

将以下配置加入全局 `~/.cursor/mcp.json`，或项目内的 `.cursor/mcp.json`。其中 `~` 表示用户主目录，配置位置见 [Cursor 官方说明](https://cursor.com/docs/mcp)。

```json
{
  "mcpServers": {
    "quanqiudaili": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "github:empty-byte/quanqiudaili-agent-tools"],
      "env": {
        "QQDL_TOKEN": "YOUR_API_KEY"
      }
    }
  }
}
```

保存后重新加载客户端，并在 Agent 对话中启用该服务。

### Claude Code

已安装 Claude Code 的用户，在终端执行以下命令，将服务添加到个人配置：

```bash
claude mcp add --scope user --env QQDL_TOKEN=YOUR_API_KEY --transport stdio quanqiudaili -- npx -y github:empty-byte/quanqiudaili-agent-tools
```

启动 Claude Code 后用 `/mcp` 查看连接状态。命令参数和配置范围见 [Claude Code 官方说明](https://code.claude.com/docs/en/mcp)。

### Codex

在用户主目录下的 `.codex/config.toml` 中添加以下配置。Codex CLI 和 IDE 扩展可以使用该配置，详见 [Codex 官方 MCP 说明](https://developers.openai.com/codex/mcp)。

```toml
[mcp_servers.quanqiudaili]
command = "npx"
args = ["-y", "github:empty-byte/quanqiudaili-agent-tools"]

[mcp_servers.quanqiudaili.env]
QQDL_TOKEN = "YOUR_API_KEY"
```

如果已安装 Codex CLI，也可以执行下面的命令，二选一即可：

```bash
codex mcp add quanqiudaili --env QQDL_TOKEN=YOUR_API_KEY -- npx -y github:empty-byte/quanqiudaili-agent-tools
```

重新启动客户端；在 Codex CLI 中可用 `/mcp` 查看连接状态。

### VS Code / GitHub Copilot

通过命令面板执行 **MCP: Open User Configuration**，在打开的 `mcp.json` 中添加以下配置。VS Code 的此种格式使用顶层 `servers`，详见[官方配置说明](https://code.visualstudio.com/docs/agents/reference/mcp-configuration)。

```json
{
  "servers": {
    "quanqiudaili": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "github:empty-byte/quanqiudaili-agent-tools"],
      "env": {
        "QQDL_TOKEN": "YOUR_API_KEY"
      }
    }
  }
}
```

启动服务器，在 Copilot 的 Agent 对话中启用它提供的工具。

### Windows 找不到 npx 时

对于上面的 JSON 或 TOML 配置，将 `command` 改为 `cmd`，并把 `args` 改为：

```json
["/c", "npx", "-y", "github:empty-byte/quanqiudaili-agent-tools"]
```

对于 Claude Code 或 Codex CLI 的添加命令，将最后 `--` 后的启动部分改成：

```text
cmd /c npx -y github:empty-byte/quanqiudaili-agent-tools
```

### 其他客户端

在支持本地 stdio MCP 的客户端中，填写以下信息：

| 配置项 | 值 |
|---|---|
| 客户端配置名称 | `quanqiudaili` |
| 连接类型 | `stdio` |
| 启动命令 | `npx` |
| 启动参数 | `-y`、`github:empty-byte/quanqiudaili-agent-tools`，按客户端要求填写为参数列表 |
| 环境变量 | `QQDL_TOKEN`，值为自己的 API Key |

也可以运行下面的命令，提前下载服务并查看常用客户端的配置参考。它只打印配置文本，不修改客户端配置，也不操作你的全球代理账号：

```bash
npx -y github:empty-byte/quanqiudaili-agent-tools setup --npx
```

## 4. 确认接入成功

保存配置后重新启动或重新加载客户端，确认 `quanqiudaili` 已连接，并允许 AI 使用它的工具。然后发送：

> 请使用全球代理工具查询我的账户余额。

能够返回真实的余额信息，说明账号鉴权和接口连接成功。接着可以发送：

> 查询我的子账号，按产品分类展示，每类先显示前 20 个。

如果 AI 没有调用工具，明确告诉它“使用 quanqiudaili 的工具查询”，并检查当前对话是否启用了工具或 Agent 模式。

## 5. 用自然语言操作

不需要记住产品 ID 或接口参数。说明产品名称、目标账号、数量、地区、时长等信息，让 AI 查询并核对。配套 Skill 按产品与购买、账号与流量、续费与带宽、删除与退单、代理连接五类工作流组织全部 38 个工具；具体操作仍受当前连接的工具范围和账号权限限制。

### 查询

> 查询我的账户余额和账号信息。

> 列出我的静态住宅原生子账号，显示国家、到期时间和备注。

> 查询美国静态住宅普通 IP 的库存和 30 天价格，先不要下单。

> 查询我上个月动态住宅流量子账号的每日流量。

### 购买

> 我想买 10 GB 动态住宅流量，请先说明不限时长和包月的区别，再查询对应价格。等我确认后再购买。

> 我想购买 5 个美国静态住宅原生 IP，使用 30 天。先核对库存、价格和余额，把购买方案告诉我。

> 我想购买一个按带宽计费的动态住宅不限流量子账号，使用 30 天。先说明可选网关和带宽要求，再试算价格、核对余额，等我确认后再下单。

### 续费与带宽升级

> 查询我的数据中心子账号，帮我找出需要续费的账号。先列出目标账号、可选时长和费用信息，不要直接续费。

> 给这几个静态住宅子账号续费 30 天，保留自动续费开关。先说明带宽续费选项以及对后续自动续费设置的影响。

> 我想提高这个子账号的带宽。先确认它支持升级、可选档位、费用和到期时间是否变化，等我同意后再操作。

### 管理与退单

> 查询我的动态住宅流量子账号，把指定账号的备注改成“项目 A”，先让我核对目标账号。

> 为这个动态住宅流量子账号设置每自然季度的流量上限。先检查本季度已用量，并说明设置后是否会停用。

> 帮我检查这个购买订单是否符合退单条件，说明退款和子账号的后续处理，再让我确认是否申请。

操作能力随产品变化，不能把一个产品的管理规则直接套用到其他产品：

| 产品类别 | 使用时需要了解的差异 |
|---|---|
| 动态住宅流量：不限时长、包月 | 每单购买整数 1–5000 GB，按整单数量匹配阶梯价；不要按旧的 300 GB 限制自动拆单。不限时长产品无到期限制；包月产品固定 30 天，到期未用完的流量会被扣除。支持动态流量子账号新增、流量查询、限流和删除等操作。 |
| 静态住宅：普通、原生、运营商原生；数据中心 | 按 IP 数量和使用时长购买，可进行适用的续费、带宽和退单操作。数据中心不支持购买或续费 7 天。 |
| 动态住宅不限流量，按带宽计费 | 按网关、带宽和时长购买，每单一个子账号；不支持自动续费。网关国家码为 `US`（美国）、`DE`（德国）、`SG`（新加坡），购买后不能更换，也不用于指定代理出口国家。支持新购、续费和升级报价，仍没有对应的库存查询工具。 |

各产品都可以通过同一个子账号列表工具查询。涉及账号 ID 时，让 AI 从查询结果中按工具说明取值，不要把用户名、子账号 ID 和订单 ID 混用。

产品 11 新购与续费使用 `product_unit_price` 试算，升级使用 `bandwidth_upgrade_price`；续费和升级必须取列表中的本地 `sub_account_id`。购买接口仍兼容旧区域码 `eu`，报价时须转换成 `DE`。报价与下单使用相同网关、带宽、周期和优惠券；报价不锁价、不占库存或优惠额度。

动态流量的报价需要按本次 GB 数匹配返回的阶梯档位，自定义价格还受优惠额度限制，不能把首档单价用于所有数量。产品 6 的 `bill_timelen` 省略或传 `1`，均为 30 天；不提供 90/180 天选项。功能是否可用取决于 MCP 版本和当前接口返回；没有适用报价时，不用其他产品的价格替代。

## 6. 写操作与确认

默认配置可以执行查询和写操作。购买、续费、升级、修改、删除或申请退单时，服务会先提示确认：支持确认弹窗的客户端可能显示弹窗，其他情况会在对话中返回操作预览和一次性确认码。

先核对产品、目标账号、数量、时长、地区或网关及带宽，再明确回复是否执行。一次性确认码与本次参数绑定，默认 5 分钟内有效，使用前还有默认 10 秒的等待期；参数变了或确认码过期，需要重新确认。等待期只是时间限制，不能判断你是否同意，AI 不能仅等到期就自行执行。

操作预览主要展示操作和参数，**不会自动查询报价或余额**。可以要求 AI 先查询适用的价格、库存和余额；没有对应报价接口时，应先说明费用信息无法通过该工具获取。实际扣费与操作结果以后端返回为准。

时长类子账号续费会保留当前自动续费开关，但本次续费时长会成为后续自动续费的时长；带宽续费选项未指定时沿用当前设置。需要分开续费的账号，AI 应按设置分别处理。

删除不可恢复；退单受产品规则、订单类型和可退期限限制，当前支持的退单审核通过后会删除对应子账号，同样不可恢复。请求超时或结果不明确时，先核对网站订单和子账号状态，再决定是否重试。

### 只想查询时

使用一体安装的用户，重复运行相同安装命令并加 `--readonly`，然后重新加载客户端即可。手动配置 MCP 的用户按下面的方式调整启动参数。

在启动参数末尾加上 `--readonly`，服务就只提供查询工具。例如 JSON 配置的 `args` 改为：

```json
["-y", "github:empty-byte/quanqiudaili-agent-tools", "--readonly"]
```

Windows 的 `cmd` 方式则使用：

```json
["/c", "npx", "-y", "github:empty-byte/quanqiudaili-agent-tools", "--readonly"]
```

只读模式仍可查询各产品的可用信息，购买、续费和修改等写工具不会被加载。需要写操作时，去掉 `--readonly` 并重新连接。

普通交互使用保持默认确认即可。`--yes` 会关闭本服务的写操作确认，仅适用于明确需要该行为的自动化环境。

## 7. 本地安装与更新

本节介绍手动 MCP 安装与更新；一体安装的更新方法见第 3 节。若希望自行管理运行目录，可以克隆源码并安装：

```bash
git clone https://github.com/empty-byte/quanqiudaili-agent-tools.git
cd quanqiudaili-agent-tools
npm ci
```

安装会自动编译。在客户端配置中，把 `command` 改为 `node`，`args` 改为安装目录中 `dist/src/index.js` 的**绝对路径**。继续保留 `env.QQDL_TOKEN`。

例如安装在 `C:/tools/quanqiudaili-agent-tools`，启动参数为：

```json
["C:/tools/quanqiudaili-agent-tools/dist/src/index.js"]
```

这是示例路径，请替换成自己电脑上的实际路径。使用只读模式时，在路径后再加一个 `"--readonly"` 参数。

更新本地安装，在安装目录依次执行：

```bash
git pull
npm ci
```

随后重启客户端。使用 GitHub `npx` 方式时，功能以下载到的发布版本为准；发现工具列表未更新时，可以改用本地安装方式明确更新版本。

## 8. 常见问题

| 情况 | 处理方法 |
|---|---|
| 提示缺少 `QQDL_TOKEN` | 将 Key 填入当前客户端配置的 `env`，然后重新连接。不要只在另一个终端窗口中设置变量。 |
| 提示 token 无效或请先登录 | 核对是否使用了网站 API Key，而不是登录密码或其他 token；必要时创建新 Key 并更新配置。 |
| 找不到 `node`、`npm` 或 `npx` | 检查 Node.js 安装和 PATH，安装后重启客户端；Windows 可使用前面的 `cmd` 启动方式。 |
| 首次启动较慢或失败 | 检查 Git 是否可用，以及 GitHub、npm 下载是否正常。可先运行 `setup --npx` 的命令完成下载，再重新连接。 |
| 连接后没有工具 | 检查服务是否启动、当前会话是否启用了 MCP 工具，必要时重新加载工具列表或重启客户端。 |
| 安装后没有看到 Skill | 重新加载客户端，检查技能是否启用及项目是否受信任；`install --dry-run` 可查看所选客户端的技能目录。只做手动 MCP 配置不会安装 Skill。 |
| 安装提示同名配置或技能冲突 | 原文件会被保留。核对现有配置与修改内容，确定要替换后使用 `--replace`；共用项目槽位的客户端改用用户级安装。 |
| 安装提示不支持项目级 | Windsurf 和 Cline 使用 `--scope user`；用 `install --list` 查看其他目标的范围。 |
| 找不到购买、续费或修改工具 | 检查启动参数是否包含 `--readonly`，以及客户端是否禁用了写工具。 |
| 返回待确认 | 核对预览后明确确认；未执行前可以拒绝，不要让 AI 连续自动重试。 |
| 无法查询某产品的价格或库存 | 先确认该产品是否有对应工具。没有报价工具时，不应把其他产品价格当成它的报价。 |
| 参数不合法或子账号不存在 | 让 AI 重新查询目标产品下的子账号，按工具要求填写参数和 ID。 |
| 请求超时或提示访问频繁 | 暂停连续请求。写操作先在网站核对是否已执行，避免重复扣费或重复创建。 |

