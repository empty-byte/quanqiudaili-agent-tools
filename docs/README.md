# 文档导航

[quanqiudaili-agent-tools](https://github.com/empty-byte/quanqiudaili-agent-tools) 提供全球代理 MCP 工具、业务 Skill 和多客户端安装入口。

| 需要了解的内容 | 文档 |
|---|---|
| 项目能力、运行要求与快速安装 | [项目 README](../README.md) |
| 客户端接入、Key 验证、配置更新及业务操作 | [使用指南](../USAGE.md) |
| 代码结构、生成流程、测试与贡献要求 | [开发指南](DEVELOPMENT.md) |
| 编码 Agent 的项目约定 | [AGENTS.md](../AGENTS.md) |
| AI 执行业务时的流程与确认边界 | [全球代理 Skill](../skills/quanqiudaili/SKILL.md) |
| 接口来源、人工修正与生成结果 | [接口规范说明](../spec/README.md) |
| 动态代理的会话与连接参数 | [Session 规范](../spec/dynamic-proxy-session.md) |

安装参数以使用指南和命令行帮助为准；工具参数以当前 MCP 暴露的 schema 为准。`spec/pages/` 是接口生成输入，可能包含上游文档尚未修正的内容，不应替代使用指南。

Skill 的 Session 副本从规范生成，不单独维护。测试覆盖范围及客户端验收要求见开发指南。
