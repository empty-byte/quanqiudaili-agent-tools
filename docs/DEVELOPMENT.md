# 开发指南

本项目包含 stdio MCP 服务、依赖 MCP 的业务 Skill，以及将两者安装到 AI 客户端的命令行入口。使用与配置见 [USAGE.md](../USAGE.md)，仓库约定见 [AGENTS.md](../AGENTS.md)。

## 本地开发

需要 Node.js 20 或更新版本及 Git：

```bash
git clone https://github.com/empty-byte/quanqiudaili-agent-tools.git
cd quanqiudaili-agent-tools
npm ci
npm test
```

`npm ci` 会自动构建。自动化测试使用本地假后端、合成凭据及临时目录，不需要真实 API Key，也不会操作开发者的客户端配置。

## 代码结构

| 位置 | 职责 |
|---|---|
| `src/index.ts` | CLI 分发、MCP 工具与资源注册 |
| `src/http.ts`、`src/form.ts` | 请求配置、表单编码、响应处理与错误脱敏 |
| `src/confirm.ts`、`src/renew.ts` | 写操作确认、续费设置保留 |
| `src/install-cli.ts` | 安装交互、Key 验证与结果提示 |
| `src/install-config.ts`、`src/install.ts` | 客户端适配、配置合并、备份与失败恢复 |
| `scripts/build-runtime.ts` | 构建随安装分发的独立运行包 |
| `skills/quanqiudaili/` | 一个 Skill 入口及五类业务参考 |
| `spec/`、`scripts/lib/merge.ts` | 原始接口页、修正规则与工具生成逻辑 |
| `test/` | 参数契约、stdio 调用、安装与流程测试 |

Skill 负责组织业务流程，MCP 负责执行工具与确认，服务端负责鉴权、计价和处理业务。Skill 不自行请求 HTTP，也不绕过 MCP 的确认机制。

安装器先通过只读用户信息接口验证 Key，再检查目标配置和文件冲突；验证失败不写入。部署的运行包位于用户目录的 `.quanqiudaili-agent-tools/versions/`，不依赖源码目录或 npx 缓存。客户端仍需按自身机制启用服务和加载技能。

## 修改接口与 Skill

1. 在 `spec/overrides.yaml` 修改工具名称、参数、说明或产品分支，不手改 `spec/tools.json`。
2. 运行 `npm run build-spec`，核对生成差异；原始接口页的来源和维护方式见 [接口规范说明](../spec/README.md)。
3. 新增工具时更新 `skills/quanqiudaili/references/tool-map.json`、对应流程参考及调用用例，保持全部工具都有归属。
4. 修改 Session 规范时编辑 `spec/dynamic-proxy-session.md`，再运行 `npm run build-skills`，不手改技能中的生成副本。
5. 运行相关测试；接口生成变更按仓库约定运行完整测试。快照只在确认行为变化符合预期后更新。

新增客户端适配时，核实其 Skill 发现路径、MCP 配置格式与支持范围，再补充隔离目录测试。不仅凭其他安装器列出客户端名称就声明本项目兼容。

## 验证范围

测试通过真实 stdio 进程与本地 HTTP 假后端验证请求编码、参数校验、写操作确认和错误处理。安装测试验证配置保留、冲突拒绝、失败恢复、Key 验证和独立运行包。

这些测试不代表所有客户端的 GUI、权限授权或所有线上业务均已验收。安装验证成功只表示当次用户信息查询通过；收费、续费、删除与退单应由维护者使用测试账号手动验收。依赖安全检查与业务测试分别进行，测试通过不能替代安全审查。

## 提交文档与发布

公开文档应使用可复制的通用命令和明确的占位符。示例不要包含真实 Key、代理账密、客户资料、订单记录、本机绝对路径、内部仓库位置或内部问题排查细节；需要业务示例时使用明确标注的合成数据。贡献者所需的架构、接口约束、能力限制和风险提示应保留在公开指南中。

本地沟通摘录、未整理方案与联调原始记录放入被 Git 忽略的 `docs/private/`，不要从公开文档链接它们。提交前检查实际文件差异；忽略规则不会清除已经提交的历史内容。

GitHub 仓库和 npm 安装包有不同的文件范围。发布前确认运行包、Skill、工具定义和 Session 规范完整，并检查打包清单中没有本机配置或内部记录：

```bash
npm run build
npm pack --dry-run --ignore-scripts --json
```

外部安装者只能获取已发布到目标分支或版本的内容。发布后验证实际下载产物，并按支持清单检查客户端的 Skill 发现与 MCP 连接；不要把本地构建成功等同于发布完成。
