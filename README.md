<h1 align="center">
  @walrus/bundle-require
</h1>

加载用户提供的配置文件，支持typescript。

<p align="center">
  <a href="https://github.com/walrusjs/bundle-require/network">
    <img src="https://img.shields.io/github/forks/walrusjs/bundle-require.svg" alt="Forks">
  </a>
  <a href="https://github.com/walrusjs/bundle-require/stargazers">
    <img src="https://img.shields.io/github/stars/walrusjs/bundle-require.svg" alt="Stars">
  </a>
  <a href="https://www.npmjs.com/package/@walrus/bundle-require">
    <img src="https://img.shields.io/npm/v/@walrus/bundle-require.svg" alt="npm version">
  </a>
</p>

## 🏗 安装

```sh
# npm
npm install @walrus/bundle-require esbuild --save

# yarn
yarn add @walrus/bundle-require esbuild

#pnpm 
pnpm install @walrus/bundle-require esbuild
```

## 🔨 使用

```ts
import { bundleRequire } from '@walrus/bundle-require';

const { mod } = await bundleRequire({
  filePath: '.walrusrc.ts'
});
```
