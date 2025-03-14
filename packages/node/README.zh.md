# tiny-mcp-runtime-node

<div align="center">
  中文 / <a href="./README.md">English</a>
</div>

Node.js 运行时管理库，`tiny-mcp-runtime` 系列的组件。

## 介绍

`tiny-mcp-runtime-node` 是一个用于管理 Node.js 运行时环境的库。它可以自动下载、安装和执行指定版本的 Node.js，并将运行时文件直接存储在依赖包中，方便应用打包和分发。

这个库特别适合需要嵌入 Node.js 环境的应用程序，如 Electron 应用、构建工具和测试框架等。

## 特性

- **自动下载安装**：自动从官方源下载并安装指定版本的 Node.js
- **灵活配置**：支持指定版本、架构和平台
- **内置版本管理**：可以同时使用多个不同版本的 Node.js
- **打包友好**：运行时文件存储在依赖包中，便于应用打包和分发
- **多平台支持**：支持 Windows、macOS 和 Linux
- **多架构支持**：支持 x64、arm64 等多种 CPU 架构

## 安装

```bash
# 基本安装
npm install tiny-mcp-runtime-node

# 指定目标架构和平台
npm install tiny-mcp-runtime-node --arch=arm64 --platform=linux
```

## 快速开始

### 基本用法

```javascript
const { NodeRuntime } = require('tiny-mcp-runtime-node');

async function main() {
  // 创建运行时实例
  const runtime = new NodeRuntime();
  
  // 安装运行时（如果已安装会跳过）
  await runtime.install();
  
  // 执行 JavaScript 代码
  const result = await runtime.execute(`
    console.log("Hello from Node.js runtime!");
    return {
      version: process.version,
      platform: process.platform,
      arch: process.arch
    };
  `);
  
  console.log("执行结果:", result);
}

main().catch(console.error);
```

### 指定版本和架构

```javascript
const runtime = new NodeRuntime({
  version: "v18.16.0",   // 指定 Node.js 版本
  arch: "arm64",         // 指定 CPU 架构
  platform: "linux"      // 指定操作系统平台
});

await runtime.install();
```

### 使用自定义路径

```javascript
const runtime = new NodeRuntime({
  runtimePath: "/path/to/your/nodejs"  // 使用自定义 Node.js 安装路径
});

await runtime.install();
```

## API 参考

### NodeRuntime 类

#### 构造函数

```javascript
new NodeRuntime(options)
```

**参数：**
- `options` (可选): 配置选项对象
  - `version` (string): Node.js 版本，默认为 "v22.9.0"
  - `runtimePath` (string): 自定义运行时路径，如果不提供则自动下载
  - `arch` (string): CPU 架构，默认为当前系统架构
  - `platform` (string): 操作系统平台，默认为当前系统平台

#### 方法

**install()**

安装 Node.js 运行时环境，如果已经安装则跳过。

```javascript
await runtime.install();
```

**execute(command)**

执行 JavaScript 代码并返回结果。

```javascript
const result = await runtime.execute('console.log("Hello"); return 42;');
```

**参数：**
- `command` (string): 要执行的 JavaScript 代码

**返回值：**
- Promise<string>: 代码执行的输出结果

**isInstalled()**

检查运行时是否已安装。

```javascript
if (runtime.isInstalled()) {
  console.log("Node.js 已安装");
}
```

**getRuntimePath()**

获取运行时安装路径。

```javascript
const path = runtime.getRuntimePath();
console.log("Node.js 安装路径:", path);
```

## 环境变量

- **TINY_MCP_SKIP_INSTALL=true**: 跳过自动安装运行时环境，适用于 CI 环境

## 支持的平台和架构

- **macOS**: arm64, x64
- **Linux**: x64, arm64, armv7l, ppc64le, s390x
- **Windows**: x64, arm64, x86/ia32

## 使用示例

### 在 Electron 应用中使用

```javascript
// 在 Electron 主进程中
const { NodeRuntime } = require('tiny-mcp-runtime-node');

async function runSecondaryNodeInstance() {
  const runtime = new NodeRuntime({ version: 'v18.16.0' });
  await runtime.install();
  
  // 在独立的 Node.js 环境中执行代码
  const result = await runtime.execute(`
    // 这段代码在独立的 Node.js 环境中运行，与 Electron 的 Node.js 版本无关
    const data = require('some-package-that-needs-node-18');
    return data.process();
  `);
  
  return result;
}
```

### 多版本管理

```javascript
async function multiVersionExample() {
  // 创建不同版本的 Node.js 运行时
  const node14 = new NodeRuntime({ version: 'v14.19.3' });
  const node16 = new NodeRuntime({ version: 'v16.15.0' });
  const node18 = new NodeRuntime({ version: 'v18.16.0' });
  
  // 安装所有版本
  await Promise.all([
    node14.install(),
    node16.install(),
    node18.install()
  ]);
  
  // 在不同版本上执行同一段代码
  const results = await Promise.all([
    node14.execute('return process.version;'),
    node16.execute('return process.version;'),
    node18.execute('return process.version;')
  ]);
  
  console.log("各版本执行结果:", results);
}
```

## 常见问题

### Q: 如何指定使用特定版本的 Node.js？
A: 使用 `version` 参数，例如 `new NodeRuntime({ version: "v16.14.0" })`。

### Q: Node.js 二进制文件存储在哪里？
A: 存储在 `node_modules/tiny-mcp-runtime-node/bin` 目录下。

### Q: 为什么我需要这个库而不是直接使用系统安装的 Node.js？
A: 这个库允许你在应用中嵌入特定版本的 Node.js，而不依赖用户系统上安装的版本，同时便于打包和分发。

### Q: 支持哪些 Node.js 版本？
A: 理论上支持所有可从 Node.js 官方下载的版本。推荐使用 LTS 版本。

## 许可证

MIT 
