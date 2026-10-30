# 接口规范与原始文档

使用与安装见 [README](../README.md) 和 [使用指南](../USAGE.md)，业务流程见 [全球代理 Skill](../skills/quanqiudaili/SKILL.md)。当前运行时以生成的 `tools.json` 为工具契约，不直接读取文档站。

| 文件或目录 | 作用 | 维护方式 |
|---|---|---|
| `pages/` | 从文档站下载的 85 份原始接口页面，包含 OpenAPI YAML；是生成器输入和快照依据。 | 由 `npm run sync-docs` 下载、归组和命名，保留上游原文；不要手工改内容或重命名。 |
| `overrides.yaml` | 工具命名、描述、参数类型、产品拆分及后端与文档差异的修正。 | 按后端实现核对后修改；文档补齐时移除相应兜底。 |
| `tools.json` | 原始页面与修正合并后的运行期定义。 | 执行 `npm run build-spec` 生成，不手改；运行时再添加写操作确认参数。 |
| `dynamic-proxy-session.md` | 动态代理连接参数和 Session 的维护原稿。 | 修改后执行 `npm run build-skills`，同步 Skill 内的生成副本；MCP 资源与 Skill 使用同源内容。 |

原始页面不是当前使用指南，可能保留旧数量上限、包月周期或缺少新增报价参数。当前已校正的规则包括：动态流量产品 1/6 每单整数 1–5000 GB、产品 6 固定 30 天、产品 11 新购/续费/升级报价参数。这些修正在 `overrides.yaml`，不能照抄原始页覆盖已经核实的规则。

修改工具后运行 `npm run build-spec`，再按仓库规则验证；工具表和生成结果必须一致。`npm run sync-docs` 会联网更新原始页并重新生成工具表，应检查差异。普通 Markdown 整理不执行同步，避免把上游文档变化混入本次修改。

`pages/` 下每个 Markdown 都会被当作接口页面解析；说明文档应放在本文件，不要在 `pages/` 内添加 README。维护约定见 [AGENTS.md](../AGENTS.md)，当日变更与历史记录索引见 [docs](../docs/README.md)。
