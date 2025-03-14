# tiny-mcp-runtime

<div align="center">
  <a href="./README.zh.md">中文</a> / English
</div>

A lightweight multi-language runtime environment management library supporting Node.js and Python. Designed for Electron applications and other projects requiring embedded runtimes.

## Important Note

**This package is primarily an abstraction layer for the runtime implementation packages. For direct usage, we recommend installing the specific runtime packages:**

- [tiny-mcp-runtime-node](./packages/node/): For Node.js runtime management
- [tiny-mcp-runtime-python](./packages/python/): For Python runtime management

This core package is better suited for developers looking to extend or customize the runtime implementation, or those creating new language runtime packages based on this framework.

## Introduction

`tiny-mcp-runtime` is a library for managing multi-language runtime environments that can:

- Automatically download and configure specified versions of Node.js or Python runtime
- Install runtimes in the project's `node_modules` directory for easy packaging and distribution
- Provide a simple API for executing code
- Support multiple operating systems and CPU architectures
- Specially designed for Electron applications and other scenarios requiring embedded runtimes

## Current Status

- **Node.js Runtime**: Fully supported on all platforms (Windows, macOS, Linux)
- **Python Runtime**: Currently fully supported only on Windows platform, support for macOS and Linux is under development (PR contributions welcome)

## Architecture Overview

The library uses a modular design consisting of these components:

- **tiny-mcp-runtime**: Core library providing runtime abstract interfaces
- **tiny-mcp-runtime-node**: Node.js runtime implementation
- **tiny-mcp-runtime-python**: Python runtime implementation

Each runtime module is an independent npm package that can be installed and used separately.

## For End Users

If you simply need a runtime environment for your application:

```bash
# For Node.js runtime
npm install tiny-mcp-runtime-node

# For Python runtime
npm install tiny-mcp-runtime-python
```

Please refer to the documentation in each package for detailed usage instructions:

- [Node.js Runtime Documentation](./packages/node/README.md)
- [Python Runtime Documentation](./packages/python/README.md)

## For Developers

If you're looking to extend this framework or create a custom runtime implementation:

1. Start by installing the core package:
   ```bash
   npm install tiny-mcp-runtime
   ```

2. Extend the `Runtime` class to implement your custom runtime:
   ```javascript
   const { Runtime } = require('tiny-mcp-runtime');
   
   class CustomRuntime extends Runtime {
     // Implement required methods
   }
   ```

## How to Contribute

We welcome community contributions, especially in the following areas:

1. Improving Python support on macOS and Linux platforms
2. Adding more features and optimizations
3. Reporting and fixing bugs
4. Improving documentation and examples

## License

MIT
