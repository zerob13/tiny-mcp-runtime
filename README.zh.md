# tiny-mcp-runtime

<div align="center">
  中文 / <a href="./README.md">English</a>
</div>

一个轻量级的多语言运行时环境管理库，支持 Node.js 和 Python。专为 Electron 应用和其他需要嵌入式运行时的项目设计。

## 重要说明

**本包主要是运行时实现包的抽象层。对于直接使用，我们建议安装特定的运行时包：**

- [tiny-mcp-runtime-node](./packages/node/)：用于 Node.js 运行时管理
- [tiny-mcp-runtime-python](./packages/python/)：用于 Python 运行时管理

核心包更适合希望扩展或自定义运行时实现的开发者，或者那些基于此框架创建新语言运行时包的开发者。

## 介绍

`tiny-mcp-runtime` 是一个用于管理多语言运行时环境的库，它可以：

- 自动下载并配置指定版本的 Node.js 或 Python 运行时
- 将运行时安装在项目的 `node_modules` 目录中，便于打包和分发
- 提供简单的 API 来执行代码
- 支持多种操作系统和 CPU 架构
- 专为 Electron 应用和其他需要嵌入式运行时的场景设计

## 当前状态

- **Node.js 运行时**: 完全支持所有平台 (Windows, macOS, Linux)
- **Python 运行时**: 目前仅在 Windows 平台完全支持，macOS 和 Linux 支持正在开发中（欢迎贡献 PR）

## 架构概述

该库采用模块化设计，由以下组件组成：

- **tiny-mcp-runtime**：核心库，提供运行时的抽象接口
- **tiny-mcp-runtime-node**：Node.js 运行时实现
- **tiny-mcp-runtime-python**：Python 运行时实现

每个运行时模块都是独立的 npm 包，可以单独安装和使用。

## 对于终端用户

如果您只是需要为应用程序提供运行时环境：

```bash
# 使用 Node.js 运行时
npm install tiny-mcp-runtime-node

# 使用 Python 运行时
npm install tiny-mcp-runtime-python
```

请参阅每个包中的文档以获取详细使用说明：

- [Node.js 运行时文档](./packages/node/README.zh.md)
- [Python 运行时文档](./packages/python/README.zh.md)

## 对于开发者

如果您希望扩展此框架或创建自定义运行时实现：

1. 首先安装核心包：
   ```bash
   npm install tiny-mcp-runtime
   ```

2. 扩展 `Runtime` 类来实现您的自定义运行时：
   ```javascript
   const { Runtime } = require('tiny-mcp-runtime');
   
   class CustomRuntime extends Runtime {
     // 实现必要的方法
   }
   ```

## 如何贡献

我们欢迎社区贡献，特别是以下方面：

1. 完善 Python 在 macOS 和 Linux 平台上的支持
2. 添加更多功能和优化
3. 报告和修复 bug
4. 改进文档和示例

## 许可证

MIT 
