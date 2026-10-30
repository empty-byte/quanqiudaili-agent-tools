import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { runInstall } from '../src/install-cli.js';

const mocks = vi.hoisted(() => ({
  text: vi.fn(),
  password: vi.fn(),
  install: vi.fn(),
  stdin: '',
}));

vi.mock('@clack/prompts', () => ({
  text: mocks.text,
  password: mocks.password,
  isCancel: (value: unknown) => typeof value === 'symbol',
  multiselect: vi.fn(),
  select: vi.fn(),
}));
vi.mock('../src/install.js', () => ({ installBundle: mocks.install }));
vi.mock('node:fs', async importOriginal => {
  const actual = await importOriginal<typeof import('node:fs')>();
  return {
    ...actual,
    readFileSync: (path: Parameters<typeof actual.readFileSync>[0], options?: Parameters<typeof actual.readFileSync>[1]) =>
      path === 0 ? mocks.stdin : actual.readFileSync(path, options),
  };
});

const args = ['--agents', 'codex', '--scope', 'user'];
const validToken = 'sk-valid-fixture-private-1234';
const wrongToken = 'sk-wrong-fixture-private-5678';
const originalTTY = Object.getOwnPropertyDescriptor(process.stdin, 'isTTY');

/**
 * 汇总安装器诊断输出，检查完整密钥和用户资料没有被再次打印。
 *
 * @return string，当前用例收集的标准输出与错误输出。
 */
function output(): string {
  return [...vi.mocked(console.log).mock.calls, ...vi.mocked(console.error).mock.calls].flat().join('\n');
}

/**
 * 生成受控后端响应，不请求真实账号。
 *
 * @param body 后端业务响应对象或原始文本。
 * @param status HTTP 状态码，省略时为 200。
 * @return Response，供真实 HTTP 适配器解析的假响应。
 */
function response(body: unknown, status = 200): Response {
  return new Response(typeof body === 'string' ? body : JSON.stringify(body), { status });
}

beforeEach(() => {
  mocks.text.mockReset();
  mocks.password.mockReset();
  mocks.install.mockReset().mockReturnValue({ runtimePath: '/fake/runtime/index.js', targets: [], changedFiles: ['fake/config'] });
  mocks.stdin = '';
  vi.stubEnv('QQDL_TOKEN', undefined);
  vi.stubEnv('QQDL_BASE_URL', undefined);
  vi.stubEnv('QQDL_TIMEOUT_MS', undefined);
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response({ code: 1, msg: 'ok', data: { id: 123, email: 'private@example.test' } })));
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
  Object.defineProperty(process.stdin, 'isTTY', { configurable: true, value: false });
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  if (originalTTY) Object.defineProperty(process.stdin, 'isTTY', originalTTY);
  else Reflect.deleteProperty(process.stdin, 'isTTY');
});

describe('安装前验证 API Key', () => {
  it('可见输入先错后对时，失败不写配置，只有正确 Key 才能安装', async () => {
    Object.defineProperty(process.stdin, 'isTTY', { configurable: true, value: true });
    mocks.text.mockResolvedValueOnce(wrongToken).mockResolvedValueOnce(` ${validToken} `);
    vi.mocked(fetch)
      .mockResolvedValueOnce(response({ code: 401, msg: `API Key 无效或已删除：${wrongToken}` }, 401))
      .mockImplementationOnce(async () => {
        expect(mocks.install).not.toHaveBeenCalled();
        return response({ code: 1, msg: 'ok', data: { id: '123', email: 'private@example.test' } });
      });

    expect(await runInstall(args)).toBe(0);
    expect(mocks.text).toHaveBeenCalledTimes(2);
    expect(mocks.password).not.toHaveBeenCalled();
    expect(mocks.install).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ token: validToken }));
    expect(fetch).toHaveBeenCalledTimes(2);
    for (const [url, init] of vi.mocked(fetch).mock.calls) {
      expect(String(url)).toBe('https://admin.quanqiudaili.com/externalapi/user/getUserInfo?is_mcp_send=1');
      expect(init?.method).toBe('GET');
    }
    expect((vi.mocked(fetch).mock.calls[1][1]?.headers as Record<string, string>).token).toBe(validToken);
    expect(output()).toMatch(/失败|无效/);
    expect(output()).toMatch(/sk-v\*+1234/);
    expect(output()).not.toContain(wrongToken);
    expect(output()).not.toContain(validToken);
    expect(output()).not.toContain('private@example.test');
  });

  it('输入错误后取消，既不安装也不继续发请求', async () => {
    Object.defineProperty(process.stdin, 'isTTY', { configurable: true, value: true });
    mocks.text.mockResolvedValueOnce(wrongToken).mockResolvedValueOnce(Symbol('cancel'));
    vi.mocked(fetch).mockResolvedValue(response({ code: 401, msg: 'API Key 无效或已删除' }, 401));
    expect(await runInstall(args)).toBe(1);
    expect(mocks.install).not.toHaveBeenCalled();
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it.each(['environment', 'stdin'])('%s 提供的错误 Key 直接失败，不转成交互或写配置', async source => {
    Object.defineProperty(process.stdin, 'isTTY', { configurable: true, value: true });
    if (source === 'environment') vi.stubEnv('QQDL_TOKEN', wrongToken);
    else mocks.stdin = `${wrongToken}\n`;
    vi.mocked(fetch).mockResolvedValue(response({ code: 401, msg: 'API Key 无效或已删除' }, 401));
    expect(await runInstall([...args, ...(source === 'stdin' ? ['--token-stdin'] : [])])).toBe(1);
    expect(mocks.install).not.toHaveBeenCalled();
    expect(mocks.text).not.toHaveBeenCalled();
    expect(output()).toMatch(/失败|无效/);
    expect(output()).not.toContain(wrongToken);
  });

  it('标准输入的正确 Key 与环境地址使用同一配置校验并安装', async () => {
    mocks.stdin = `${validToken}\n`;
    vi.stubEnv('QQDL_TOKEN', wrongToken);
    vi.stubEnv('QQDL_BASE_URL', 'https://test-backend.example/');
    vi.stubEnv('QQDL_TIMEOUT_MS', '1500');
    expect(await runInstall([...args, '--token-stdin'])).toBe(0);
    expect(String(vi.mocked(fetch).mock.calls[0][0])).toBe('https://test-backend.example/externalapi/user/getUserInfo?is_mcp_send=1');
    expect(mocks.install).toHaveBeenCalledWith(expect.objectContaining({ token: validToken, baseUrl: 'https://test-backend.example', timeoutMs: 1500 }));
    expect(mocks.text).not.toHaveBeenCalled();
  });

  it.each([
    ['HTTP 401 即使业务码成功', 401, { code: 1, data: { id: 123 } }],
    ['HTTP 403 即使业务码成功', 403, { code: 1, data: { id: 123 } }],
    ['HTTP 500 即使业务码成功', 500, { code: 1, data: { id: 123 } }],
    ['限流', 200, { code: 0, msg: '访问频繁,请稍后再试!' }],
    ['畸形 JSON', 200, '{not-json'],
    ['布尔业务码', 200, { code: true, data: { id: 123 } }],
    ['缺失用户资料', 200, { code: 1 }],
    ['缺失用户 ID', 200, { code: 1, data: {} }],
    ['非整数用户 ID', 200, { code: 1, data: { id: 1.5 } }],
  ])('%s 阻止安装', async (_name, status, body) => {
    vi.stubEnv('QQDL_TOKEN', validToken);
    vi.mocked(fetch).mockResolvedValue(response(body, status));
    expect(await runInstall(args)).toBe(1);
    expect(mocks.install).not.toHaveBeenCalled();
    expect(output()).not.toContain(validToken);
  });

  it.each([
    new Error('fetch failed'),
    Object.assign(new Error('timed out'), { name: 'TimeoutError' }),
  ])('网络错误或超时阻止安装并提示验证未通过', async error => {
    vi.stubEnv('QQDL_TOKEN', validToken);
    vi.mocked(fetch).mockRejectedValue(error);
    expect(await runInstall(args)).toBe(1);
    expect(mocks.install).not.toHaveBeenCalled();
    expect(output()).toMatch(/失败|未响应|超时/);
  });

  it('短 Key 的验证提示全部遮罩', async () => {
    vi.stubEnv('QQDL_TOKEN', 'abcd');
    expect(await runInstall(args)).toBe(0);
    expect(output()).toContain('****');
    expect(output()).not.toContain('abcd');
  });

  it('非交互缺少 Key 时立即失败，不发请求或写配置', async () => {
    expect(await runInstall(args)).toBe(1);
    expect(fetch).not.toHaveBeenCalled();
    expect(mocks.install).not.toHaveBeenCalled();
    expect(output()).toContain('QQDL_TOKEN');
  });

  it.each([['--help'], ['--list'], [...args, '--dry-run']])('%j 无需凭据，也不访问后端', async (...options) => {
    expect(await runInstall(options)).toBe(0);
    expect(fetch).not.toHaveBeenCalled();
    expect(mocks.text).not.toHaveBeenCalled();
    if (options.includes('--dry-run')) expect(mocks.install).toHaveBeenCalledWith(expect.objectContaining({ dryRun: true }));
    else expect(mocks.install).not.toHaveBeenCalled();
  });
});
