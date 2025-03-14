# tiny-mcp-runtime

一个轻量级的多语言运行时环境管理库，支持Node.js和Python。

## 特性

- 自动下载并配置Node.js/Python运行时
- 支持自定义运行时路径
- 模块化设计，可以只安装需要的运行时环境
- 支持不同操作系统和架构
- 打包友好，适合Electron应用使用

## 安装

```bash
# 安装核心包
npm install tiny-mcp-runtime

# 安装Node.js运行时
npm install tiny-mcp-runtime-node

# 安装Python运行时
npm install tiny-mcp-runtime-python

# 指定目标架构和平台(可选)
npm install tiny-mcp-runtime-node --arch=arm64 --platform=linux
```

## 使用方法

### Node.js 运行时

```javascript
const { NodeRuntime } = require('tiny-mcp-runtime-node');

// 使用默认配置（自动下载Node.js v22.9.0）
const runtime = new NodeRuntime();
await runtime.install();

// 或指定自定义路径
const customRuntime = new NodeRuntime({
  runtimePath: '/path/to/your/nodejs'
});
await customRuntime.install();

// 或指定不同的版本和架构
const armRuntime = new NodeRuntime({
  version: 'v18.16.0',
  arch: 'arm64',
  platform: 'linux'
});
await armRuntime.install();

// 执行命令
const result = await runtime.execute('console.log("Hello, World!")');
console.log(result);
```

### Python 运行时

```javascript
const { PythonRuntime } = require('tiny-mcp-runtime-python');

// 使用默认配置（自动下载Python 3.10.0）
const runtime = new PythonRuntime();
await runtime.install();

// 或指定自定义路径
const customRuntime = new PythonRuntime({
  runtimePath: '/path/to/your/python'
});
await customRuntime.install();

// 或指定不同的版本和架构
const armRuntime = new PythonRuntime({
  version: '3.9.0',
  arch: 'arm64', 
  platform: 'linux'
});
await armRuntime.install();

// 执行命令
const result = await runtime.execute('print("Hello, World!")');
console.log(result);
```

## 支持的平台和架构

### Node.js

- **macOS**: arm64, x64
- **Linux**: x64, arm64, armv7l, ppc64le, s390x
- **Windows**: x64, arm64, x86/ia32

### Python

- **macOS**: arm64, x64
- **Linux**: x64, arm64, armv7l
- **Windows**: amd64, arm64, x86

## 许可证

MIT
