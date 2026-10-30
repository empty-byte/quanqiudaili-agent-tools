# quanqiudaili-agent-tools

在 Claude Code、Cursor、Codex 等 AI 客户端中使用全球代理：查询余额、选购代理、提取连接配置，以及续费和管理子账号。一次安装配套 Skill 与 MCP。

## 快速开始

### 1. 准备环境和 API Key

- 安装 [Node.js 20 或更新版本](https://nodejs.org/en/download)和 [Git](https://git-scm.com/downloads)，确保终端能运行 `npx`、`git`，并能访问 GitHub 和 npm。
- 登录[全球代理网站](https://www.quanqiudaili.com/)，在 **API Keys** 页面创建并复制 API Key。[查看获取方法](https://develop.quanqiudaili.com/9518262m0)。

### 2. 运行安装命令

在电脑终端中执行（Windows PowerShell、macOS/Linux 终端均可）：

```bash
npx -y github:empty-byte/quanqiudaili-agent-tools install
```

命令会自动从 GitHub 下载项目、安装依赖并构建，无需提前下载源码或运行 `npm ci`。首次执行需要等待下载完成。

按提示完成三项选择：

1. 选择你使用的客户端：空格勾选，可多选，回车继续。
2. 安装范围选择“当前用户的所有项目”，后续项目也能使用。
3. 输入 API Key（必填，输入时可见）；验证通过后才开始安装。输错可重新输入，`Ctrl+C` 取消。

如果终端已设置 `QQDL_TOKEN`，会直接使用它验证；验证失败需修正该环境变量后重跑命令。

### 3. 重启客户端并开始使用

重启刚才选择的客户端，按其提示启用 `quanqiudaili` MCP 和 Skill，然后向 AI 提问：

> 使用全球代理，查询我的账户余额。

能通过工具返回余额后，再尝试：

- “帮我查一下美国静态住宅代理的价格和库存。”
- “列出我的子账号，并查看流量使用情况。”
- “用我已有的动态住宅账号生成代理连接配置。”

没有找到工具或连接失败时，查看[使用指南与常见问题](https://github.com/empty-byte/quanqiudaili-agent-tools/blob/main/USAGE.md)。

## 指定客户端安装

只安装到 Codex：

```bash
npx -y github:empty-byte/quanqiudaili-agent-tools install --agents codex
```

也可以一次选择多个客户端：

```bash
npx -y github:empty-byte/quanqiudaili-agent-tools install --agents claude-code,cursor,codex
```

目前提供 Claude Code、Cursor、Codex、Gemini CLI、OpenCode、GitHub Copilot CLI、VS Code Copilot、Windsurf、Kiro CLI、Zed、Cline 的安装适配。客户端名称与安装范围见[完整列表](https://github.com/empty-byte/quanqiudaili-agent-tools/blob/main/USAGE.md#一次安装-skills-与-mcp)。

## 常用选项

以下选项追加在安装命令末尾，例如 `install --agents codex --readonly`。

| 选项 | 用途 |
| --- | --- |
| `--agents codex,cursor` | 指定一个或多个客户端，省略时交互选择。 |
| `--readonly` | 仅安装查询工具，不开放购买、续费和删除等写操作。 |
| `--scope user` | 安装到当前用户，所有项目可用。 |
| `--scope project` | 仅安装到当前项目，执行前先进入目标项目目录。 |
| `--dry-run` | 预览安装位置，不写文件、不验证 Key。 |
| `--list` / `--help` | 查看支持的客户端或完整命令帮助。 |

Windsurf 和 Cline 仅支持用户级安装。Claude Code 与 GitHub Copilot CLI 同时使用时，请选择用户级，避免项目配置冲突。

## 使用须知

- 安装只验证 API Key 并配置客户端，不会购买产品。购买、续费、删除等操作会先请求确认，请核对费用和操作对象后再同意。
- API Key 保存在所选客户端的本地配置中，备份也可能包含 Key。不要将这些配置、备份或真实 Key 提交到仓库或分享。
- 需要更新或更换 Key 时，用相同客户端和范围重新安装；自动化安装、配置冲突处理及手动接入 MCP 见[使用指南](https://github.com/empty-byte/quanqiudaili-agent-tools/blob/main/USAGE.md)。当前没有卸载命令。

## 更多文档

- [使用指南](https://github.com/empty-byte/quanqiudaili-agent-tools/blob/main/USAGE.md)：安装选项、手动 MCP 配置、使用示例与常见问题。
- [Skill 操作说明](https://github.com/empty-byte/quanqiudaili-agent-tools/blob/main/skills/quanqiudaili/SKILL.md)：产品选择与各类操作流程。
- [API 文档](https://develop.quanqiudaili.com/)：接口与产品规则。
- [开发与维护](https://github.com/empty-byte/quanqiudaili-agent-tools/blob/main/AGENTS.md)：项目结构、构建、测试与工具定义维护。

<details>
<summary>从源码安装或参与开发</summary>

需要自行管理源码时，在终端依次执行：

```bash
git clone https://github.com/empty-byte/quanqiudaili-agent-tools.git
cd quanqiudaili-agent-tools
npm ci
node dist/src/index.js install
```

`npm ci` 会安装依赖并自动构建。已有源码时，进入项目根目录后执行后两条命令即可；运行 `npm test` 可执行本地测试。

</details>

## 许可

[MIT](https://github.com/empty-byte/quanqiudaili-agent-tools/blob/main/LICENSE)
