import { copyFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// 安装后的技能不一定能读取 MCP resource，随包副本始终从同一份规范生成。
const target = new URL('../skills/quanqiudaili/references/generated/', import.meta.url);
mkdirSync(target, { recursive: true });
copyFileSync(new URL('../spec/dynamic-proxy-session.md', import.meta.url), fileURLToPath(new URL('dynamic-proxy-session.md', target)));
