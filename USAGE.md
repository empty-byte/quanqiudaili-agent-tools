# 全球代理 MCP 使用指南

全球代理 MCP 可以把你的全球代理账号接入 AI 客户端。配置完成后，用自然语言查询余额、产品、子账号、库存和价格，也可以在确认后购买、续费或管理子账号。

本指南适用于动态住宅流量（不限时长、包月）、静态住宅（普通、原生、运营商原生）、数据中心，以及按带宽计费的动态住宅不限流量。所有产品使用同一份接入配置，具体功能取决于产品规则、账号权限和当前发布版本。

- 全球代理网站：[quanqiudaili.com](https://www.quanqiudaili.com/)
- 项目地址：[quanqiudaili-mcp](https://github.com/empty-byte/quanqiudaili-mcp)

## 1. 使用前准备

准备以下环境：

1. 一个全球代理账号，以及在网站 **API Keys** 页面创建的 API Key。
2. 一个支持本地 MCP 服务的 AI 客户端，例如 Claude Desktop、Claude Code、Codex、Cursor 或 VS Code 的 Copilot Agent。
3. [Node.js 24 LTS](https://nodejs.org/en/download)，安装后应能使用 `node`、`npm` 和 `npx`。
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

将下面示例中的 `YOUR_API_KEY` 替换为自己的 Key。它应填入客户端配置的 `QQDL_TOKEN`，不需要把网站登录密码交给 AI。

API Key 用于访问你的账号，包含已授权的查询和管理能力。请保存在本机配置中，不要把真实 Key 放进公开网页、代码仓库或共享截图。

## 3. 接入 AI 客户端

推荐使用下面的启动命令，由 `npx` 从 GitHub 下载并运行：

```bash
npx -y github:empty-byte/quanqiudaili-mcp
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
      "args": ["-y", "github:empty-byte/quanqiudaili-mcp"],
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
      "args": ["-y", "github:empty-byte/quanqiudaili-mcp"],
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
claude mcp add --scope user --env QQDL_TOKEN=YOUR_API_KEY --transport stdio quanqiudaili -- npx -y github:empty-byte/quanqiudaili-mcp
```

启动 Claude Code 后用 `/mcp` 查看连接状态。命令参数和配置范围见 [Claude Code 官方说明](https://code.claude.com/docs/en/mcp)。

### Codex

在用户主目录下的 `.codex/config.toml` 中添加以下配置。Codex CLI 和 IDE 扩展可以使用该配置，详见 [Codex 官方 MCP 说明](https://developers.openai.com/codex/mcp)。

```toml
[mcp_servers.quanqiudaili]
command = "npx"
args = ["-y", "github:empty-byte/quanqiudaili-mcp"]

[mcp_servers.quanqiudaili.env]
QQDL_TOKEN = "YOUR_API_KEY"
```

如果已安装 Codex CLI，也可以执行下面的命令，二选一即可：

```bash
codex mcp add quanqiudaili --env QQDL_TOKEN=YOUR_API_KEY -- npx -y github:empty-byte/quanqiudaili-mcp
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
      "args": ["-y", "github:empty-byte/quanqiudaili-mcp"],
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
["/c", "npx", "-y", "github:empty-byte/quanqiudaili-mcp"]
```

对于 Claude Code 或 Codex CLI 的添加命令，将最后 `--` 后的启动部分改成：

```text
cmd /c npx -y github:empty-byte/quanqiudaili-mcp
```

### 其他客户端

在支持本地 stdio MCP 的客户端中，填写以下信息：

| 配置项 | 值 |
|---|---|
| 服务名称 | `quanqiudaili` |
| 连接类型 | `stdio` |
| 启动命令 | `npx` |
| 启动参数 | `-y`、`github:empty-byte/quanqiudaili-mcp`，按客户端要求填写为参数列表 |
| 环境变量 | `QQDL_TOKEN`，值为自己的 API Key |

也可以运行下面的命令，提前下载服务并查看常用客户端的配置参考。它只打印配置文本，不修改客户端配置，也不操作你的全球代理账号：

```bash
npx -y github:empty-byte/quanqiudaili-mcp setup --npx
```

## 4. 确认接入成功

保存配置后重新启动或重新加载客户端，确认 `quanqiudaili` 已连接，并允许 AI 使用它的工具。然后发送：

> 请使用全球代理工具查询我的账户余额。

能够返回真实的余额信息，说明账号鉴权和接口连接成功。接着可以发送：

> 查询我的子账号，按产品分类展示，每类先显示前 20 个。

如果 AI 没有调用工具，明确告诉它“使用 quanqiudaili 的工具查询”，并检查当前对话是否启用了工具或 Agent 模式。

## 5. 用自然语言操作

不需要记住产品 ID 或接口参数。说明产品名称、目标账号、数量、地区、时长等信息，让 AI 查询并核对。

### 查询

> 查询我的账户余额和账号信息。

> 列出我的静态住宅原生子账号，显示国家、到期时间和备注。

> 查询美国静态住宅普通 IP 的库存和 30 天价格，先不要下单。

> 查询我上个月动态住宅流量子账号的每日流量。

### 购买

> 我想买 10 GB 动态住宅流量，请先说明不限时长和包月的区别，再查询对应价格。等我确认后再购买。

> 我想购买 5 个美国静态住宅原生 IP，使用 30 天。先核对库存、价格和余额，把购买方案告诉我。

> 我想购买一个按带宽计费的动态住宅不限流量子账号，使用 30 天。先说明可选网关、带宽要求和费用能否查询，等我确认后再下单。

### 续费与带宽升级

> 查询我的数据中心子账号，帮我找出需要续费的账号。先列出目标账号、可选时长和费用信息，不要直接续费。

> 给这几个静态住宅子账号续费 30 天，保留自动续费开关。先说明带宽续费选项以及对后续自动续费设置的影响。

> 我想提高这个子账号的带宽。先确认它支持升级、可选档位、费用和到期时间是否变化，等我同意后再操作。

### 管理与退单

> 查询我的动态住宅流量子账号，把指定账号的备注改成“项目 A”，先让我核对目标账号。

> 为这个动态住宅流量子账号设置流量上限。先检查当前已用量，并说明设置后是否会停用。

> 帮我检查这个购买订单是否符合退单条件，说明退款和子账号的后续处理，再让我确认是否申请。

操作能力随产品变化，不能把一个产品的管理规则直接套用到其他产品：

| 产品类别 | 使用时需要了解的差异 |
|---|---|
| 动态住宅流量：不限时长、包月 | 按 GB 购买；支持动态流量子账号的新增、流量查询、限流和删除等操作。包月流量有有效期，到期未用完的流量会被扣除。 |
| 静态住宅：普通、原生、运营商原生；数据中心 | 按 IP 数量和使用时长购买，可进行适用的续费、带宽和退单操作。数据中心不支持购买或续费 7 天。 |
| 动态住宅不限流量，按带宽计费 | 按网关区域、带宽和时长购买，每单一个子账号；不支持自动续费。网关为 `us`（美洲）、`sg`（亚洲）、`eu`（欧洲），购买后不能更换；当前没有对应的公开库存和报价工具。 |

各产品都可以通过同一个子账号列表工具查询。涉及账号 ID 时，让 AI 从查询结果中按工具说明取值，不要把用户名、子账号 ID 和订单 ID 混用。

## 6. 写操作与确认

默认配置可以执行查询和写操作。购买、续费、升级、修改、删除或申请退单时，服务会先提示确认：支持确认弹窗的客户端可能显示弹窗，其他情况会在对话中返回操作预览和一次性确认码。

先核对产品、目标账号、数量、时长、地区或网关及带宽，再明确回复是否执行。一次性确认码与本次参数绑定，默认 5 分钟内有效，使用前还有默认 10 秒的等待期；参数变了或确认码过期，需要重新确认。

操作预览主要展示操作和参数，**不会自动查询报价或余额**。可以要求 AI 先查询适用的价格、库存和余额；没有对应报价接口时，应先说明费用信息无法通过该工具获取。实际扣费与操作结果以后端返回为准。

时长类子账号续费会保留当前自动续费开关，但本次续费时长会成为后续自动续费的时长；带宽续费选项未指定时沿用当前设置。需要分开续费的账号，AI 应按设置分别处理。

删除不可恢复；退单受产品规则、订单类型和可退期限限制，当前支持的退单审核通过后会删除对应子账号，同样不可恢复。请求超时或结果不明确时，先核对网站订单和子账号状态，再决定是否重试。

### 只想查询时

在启动参数末尾加上 `--readonly`，服务就只提供查询工具。例如 JSON 配置的 `args` 改为：

```json
["-y", "github:empty-byte/quanqiudaili-mcp", "--readonly"]
```

Windows 的 `cmd` 方式则使用：

```json
["/c", "npx", "-y", "github:empty-byte/quanqiudaili-mcp", "--readonly"]
```

只读模式仍可查询各产品的可用信息，购买、续费和修改等写工具不会被加载。需要写操作时，去掉 `--readonly` 并重新连接。

普通交互使用保持默认确认即可。`--yes` 会关闭本服务的写操作确认，仅适用于明确需要该行为的自动化环境。

## 7. 本地安装与更新

如果希望自行管理安装目录，也可以克隆源码并安装：

```bash
git clone https://github.com/empty-byte/quanqiudaili-mcp.git
cd quanqiudaili-mcp
npm ci
```

安装会自动编译。在客户端配置中，把 `command` 改为 `node`，`args` 改为安装目录中 `dist/src/index.js` 的**绝对路径**。继续保留 `env.QQDL_TOKEN`。

例如安装在 `C:/tools/quanqiudaili-mcp`，启动参数为：

```json
["C:/tools/quanqiudaili-mcp/dist/src/index.js"]
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
| 找不到购买、续费或修改工具 | 检查启动参数是否包含 `--readonly`，以及客户端是否禁用了写工具。 |
| 返回待确认 | 核对预览后明确确认；未执行前可以拒绝，不要让 AI 连续自动重试。 |
| 无法查询某产品的价格或库存 | 先确认该产品是否有对应工具。没有报价工具时，不应把其他产品价格当成它的报价。 |
| 参数不合法或子账号不存在 | 让 AI 重新查询目标产品下的子账号，按工具要求填写参数和 ID。 |
| 请求超时或提示访问频繁 | 暂停连续请求。写操作先在网站核对是否已执行，避免重复扣费或重复创建。 |

