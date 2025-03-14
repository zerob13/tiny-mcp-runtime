# tiny-mcp-runtime

一个轻量级的多语言运行时环境管理库，支持Node.js和Python。

## 特性

- 自动下载并配置Node.js/Python运行时
- 支持自定义运行时路径
- 模块化设计，可以只安装需要的运行时环境

## 安装

```bash
# 安装核心包
npm install tiny-mcp-runtime

# 安装Node.js运行时
npm install tiny-mcp-runtime-node

# 安装Python运行时
npm install tiny-mcp-runtime-python
```

## 使用方法

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

// 执行命令
const result = await runtime.execute('console.log("Hello, World!")');
console.log(result);
```

## 许可证

MIT
