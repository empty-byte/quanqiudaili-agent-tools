import { build } from 'esbuild';

// 安装器复制独立运行包，客户端启动不依赖 npx 缓存目录或开发依赖。
await build({
  entryPoints: ['src/index.ts'],
  outfile: 'dist/runtime/index.js',
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'node20',
  banner: { js: 'import { createRequire as __createRequire } from "node:module"; const require = __createRequire(import.meta.url);' },
});
