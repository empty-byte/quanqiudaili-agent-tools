import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { isCancel, multiselect, text, select } from '@clack/prompts';
import { agents, detectGlobalAgents } from 'add-mcp';
import { INSTALL_AGENTS, type InstallAgent, type InstallScope } from './install-config.js';
import { installBundle } from './install.js';
import { callApi, cfgFromEnv, type Cfg } from './http.js';

const HELP = `用法：quanqiudaili-agent-tools install [选项]
一次安装业务 Skill 和本地 MCP，保留写操作确认。
QQDL_TOKEN（网站 API Key）为必填凭据；交互输入时直接显示，验证提示只显示首尾。
安装前查询用户信息验证 Key，失败不写入；交互输入错误可重输，Ctrl+C 取消。

  --agents 名称列表   逗号分隔，可多次指定；不传时交互选择
  --scope user       用户级（默认）或 project 项目级
  --readonly         仅开放查询工具
  --token-stdin      从标准输入读取 API Key；也可用 QQDL_TOKEN 或交互输入
  --dry-run          只显示目标路径，不写文件、不连接后端，不要求 API Key
  --replace          替换所选 Agent 已有的同名服务和冲突技能文件
  --list             列出支持的 Agent
  --help             显示帮助

重复执行 install 可更新本安装器管理的配置与技能。
真实 API Key 只写入所选客户端本地配置，不写入 Skill；项目级配置请勿提交。
安装期间仅请求只读用户信息接口验证 Key，不执行购买、续费或删除。`;

/**
 * 在验证提示中只保留 Key 首尾各四位，短 Key 全部遮罩。
 *
 * @param token 已去除首尾空白的凭据。
 * @return string，可用于安装提示的脱敏文本。
 */
function maskToken(token: string): string {
  return token.length > 8 ? `${token.slice(0, 4)}****${token.slice(-4)}` : '****';
}

/**
 * 执行独立安装入口，不改变 setup 仅输出配置的行为。
 *
 * @param argv install 后的命令行参数。
 * @return Promise<number>，退出码，0 表示安装或预览完成，1 表示失败或取消。
 */
export async function runInstall(argv: string[]): Promise<number> {
  try {
    const color = process.stdout.isTTY && process.stdout.hasColors?.();
    const { values } = parseArgs({ args: argv, strict: true, options: {
      agents: { type: 'string', multiple: true },
      scope: { type: 'string' },
      readonly: { type: 'boolean' },
      'token-stdin': { type: 'boolean' },
      'dry-run': { type: 'boolean' },
      replace: { type: 'boolean' },
      list: { type: 'boolean' },
      help: { type: 'boolean' },
    } });
    if (values.help) { console.log(HELP); return 0; }
    if (values.list) {
      for (const id of Object.keys(INSTALL_AGENTS) as InstallAgent[]) {
        console.log(`${id}\t${agents[id].displayName}\t${agents[id].localConfigPath ? 'user / project' : 'user'}`);
      }
      return 0;
    }
    let selected = values.agents?.flatMap(value => value.split(',').map(id => id.trim())).filter(Boolean);
    if (selected?.some(id => !Object.hasOwn(INSTALL_AGENTS, id))) throw new Error('Agent 名称不受支持，请执行 install --list 查看列表。');
    if (!selected?.length) {
      if (!process.stdin.isTTY) throw new Error('非交互安装请用 --agents 指定目标。');
      const detected = await detectGlobalAgents();
      const answer = await multiselect({
        message: '选择安装全球代理的 Agent（空格选择，回车继续）：',
        options: (Object.keys(INSTALL_AGENTS) as InstallAgent[]).map(id => ({ value: id, label: agents[id].displayName, hint: detected.includes(id) ? '已检测到' : undefined })),
        required: true,
      });
      if (isCancel(answer)) return 1;
      selected = answer;
    }
    let scope = values.scope ?? 'user';
    if (!values.scope && process.stdin.isTTY) {
      const answer = await select({ message: '安装范围：', options: [
        { value: 'user', label: '当前用户的所有项目' },
        { value: 'project', label: '当前项目' },
      ] });
      if (isCancel(answer)) return 1;
      scope = answer;
    }
    if (scope !== 'user' && scope !== 'project') throw new Error('--scope 只能是 user 或 project。');
    let token = (values['token-stdin'] ? readFileSync(0, 'utf8') : process.env.QQDL_TOKEN)?.trim();
    let apiConfig: Pick<Cfg, 'baseUrl' | 'timeoutMs'> | undefined;
    if (!values['dry-run']) {
      const interactiveToken = !token && !values['token-stdin'] && process.stdin.isTTY;
      if (!token && !interactiveToken) throw new Error('请通过 QQDL_TOKEN 或 --token-stdin 提供 API Key。');
      while (true) {
        if (interactiveToken) {
          const answer = await text({
            message: '输入 QQDL_TOKEN（网站 API Key，必填，输入时可见；Ctrl+C 取消）：',
            validate: value => !value.trim() ? 'QQDL_TOKEN（API Key）为必填项，不能为空。'
              : /[\x00-\x1f\x7f]/.test(value.trim()) ? 'API Key 不能包含控制字符，请重新复制。' : undefined,
          });
          if (isCancel(answer)) return 1;
          token = answer.trim();
        }
        const cfg = cfgFromEnv({ ...process.env, QQDL_TOKEN: token });
        console.log(`正在验证 API Key（${maskToken(cfg.token)}）…`);
        const response = await callApi({ method: 'GET', path: '/externalapi/user/getUserInfo', pick: 'id' }, {}, cfg);
        const message = response.content.find(item => item.type === 'text')?.text ?? '';
        // 只检查用户标识，不把完整账号资料输出到终端。
        const id: unknown = response.isError ? undefined : JSON.parse(message).data;
        if (!response.isError && (typeof id === 'number' && Number.isInteger(id) && id > 0 || typeof id === 'string' && /^[1-9]\d*$/.test(id))) {
          apiConfig = { baseUrl: cfg.baseUrl, timeoutMs: cfg.timeoutMs };
          const success = 'API Key 验证通过，开始安装。';
          console.log(color ? `\x1b[1;32m${success}\x1b[0m` : success);
          break;
        }
        const reason = response.isError ? message.replace(/[\x00-\x1f\x7f]/g, ' ') : '用户信息响应不完整，无法确认 Key 是否有效。';
        const failure = `API Key 验证失败，尚未安装：${reason}`;
        console.error(process.stderr.isTTY && process.stderr.hasColors?.() ? `\x1b[1;31m${failure}\x1b[0m` : failure);
        if (!interactiveToken) return 1;
        console.log('请核对 Key 或网络后重新输入；Ctrl+C 取消。');
      }
    }
    const result = installBundle({
      agents: selected as InstallAgent[], scope: scope as InstallScope,
      cwd: process.cwd(), sourceRoot: fileURLToPath(new URL('../../', import.meta.url)),
      token, ...apiConfig, readonly: values.readonly, dryRun: values['dry-run'], replace: values.replace,
    });
    if (values['dry-run']) {
      console.log('安装预览（未写入）：');
      for (const target of result.targets) console.log(`${target.agent}\n  Skill: ${target.skillPath}\n  MCP: ${target.configPath}`);
      console.log(`运行入口: ${result.runtimePath}`);
    } else {
      for (const message of [
        ...result.targets.map(target => `${target.agent}：Skill 和 MCP 配置已安装`),
        '请重启对应客户端，即可使用全球代理。',
      ]) console.log(color ? `\x1b[1;32m${message}\x1b[0m` : message);
    }
    return 0;
  } catch (error) {
    // 不输出第三方异常上下文，避免解析错误或命令参数带出密钥。
    const message = error instanceof Error ? error.message : '安装失败。';
    const known = /^(请选择|需要有效|QQDL_TOKEN 格式|QQDL_TIMEOUT_MS|安装|客户端|MCP 配置|技能|运行包|已安装|多个 Agent|Agent 名称|非交互|请通过|--scope|测试目录|[\w-]+ (?:不支持项目级|暂不支持|已有不同|与其他 Agent))/;
    console.error(known.test(message) ? message : '安装失败，请检查参数、安装包和目标目录权限；可用 install --help 查看用法。');
    return 1;
  }
}
