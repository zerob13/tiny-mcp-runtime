# tiny-mcp-runtime-nodejs

<div align="center">
  <a href="./README.zh.md">中文</a> / English
</div>

Node.js Runtime Management Library, a component of the `tiny-mcp-runtime` series.

## Introduction

`tiny-mcp-runtime-nodejs` is a library for managing Node.js runtime environments. It can automatically download, install, and execute specified versions of Node.js, storing the runtime files directly in the dependency package for easy application packaging and distribution.

This library is particularly suitable for applications that need to embed Node.js environments, such as Electron applications, build tools, and testing frameworks.

## Features

- **Automatic Installation**: Automatically download and install specified versions of Node.js from official sources
- **Flexible Configuration**: Support for specifying versions, architectures, and platforms
- **Built-in Version Management**: Ability to use multiple different versions of Node.js simultaneously
- **Packaging Friendly**: Runtime files stored in the dependency package for easy application packaging and distribution
- **Multi-platform Support**: Supports Windows, macOS, and Linux
- **Multi-architecture Support**: Supports various CPU architectures including x64, arm64

## Installation

```bash
# Basic installation
npm install tiny-mcp-runtime-nodejs

# Specify target architecture and platform
npm install tiny-mcp-runtime-nodejs --arch=arm64 --platform=linux
```

## Quick Start

### Basic Usage

```javascript
const { NodeRuntime } = require('tiny-mcp-runtime-nodejs');

async function main() {
  // Create runtime instance
  const runtime = new NodeRuntime();
  
  // Install runtime (skips if already installed)
  await runtime.install();
  
  // Execute JavaScript code
  const result = await runtime.execute(`
    console.log("Hello from Node.js runtime!");
    return {
      version: process.version,
      platform: process.platform,
      arch: process.arch
    };
  `);
  
  console.log("Execution result:", result);
}

main().catch(console.error);
```

### Specify Version and Architecture

```javascript
const runtime = new NodeRuntime({
  version: "v18.16.0",   // Specify Node.js version
  arch: "arm64",         // Specify CPU architecture
  platform: "linux"      // Specify operating system platform
});

await runtime.install();
```

### Use Custom Path

```javascript
const runtime = new NodeRuntime({
  runtimePath: "/path/to/your/nodejs"  // Use custom Node.js installation path
});

await runtime.install();
```

## API Reference

### NodeRuntime Class

#### Constructor

```javascript
new NodeRuntime(options)
```

**Parameters:**
- `options` (optional): Configuration options object
  - `version` (string): Node.js version, defaults to "v22.9.0"
  - `runtimePath` (string): Custom runtime path, auto-downloads if not provided
  - `arch` (string): CPU architecture, defaults to current system architecture
  - `platform` (string): Operating system platform, defaults to current system platform

#### Methods

**install()**

Install the Node.js runtime environment, skips if already installed.

```javascript
await runtime.install();
```

**execute(command)**

Execute JavaScript code and return the result.

```javascript
const result = await runtime.execute('console.log("Hello"); return 42;');
```

**Parameters:**
- `command` (string): JavaScript code to execute

**Return value:**
- Promise<string>: Output result of code execution

**isInstalled()**

Check if the runtime is installed.

```javascript
if (runtime.isInstalled()) {
  console.log("Node.js is installed");
}
```

**getRuntimePath()**

Get the runtime installation path.

```javascript
const path = runtime.getRuntimePath();
console.log("Node.js installation path:", path);
```

## Environment Variables

- **TINY_MCP_SKIP_INSTALL=true**: Skip automatic runtime installation, suitable for CI environments

## Supported Platforms and Architectures

- **macOS**: arm64, x64
- **Linux**: x64, arm64, armv7l, ppc64le, s390x
- **Windows**: x64, arm64, x86/ia32

## Usage Examples

### Using in Electron Applications

```javascript
// In Electron main process
const { NodeRuntime } = require('tiny-mcp-runtime-nodejs');

async function runSecondaryNodeInstance() {
  const runtime = new NodeRuntime({ version: 'v18.16.0' });
  await runtime.install();
  
  // Execute code in an independent Node.js environment
  const result = await runtime.execute(`
    // This code runs in an independent Node.js environment, 
    // unrelated to Electron's Node.js version
    const data = require('some-package-that-needs-node-18');
    return data.process();
  `);
  
  return result;
}
```

### Multi-version Management

```javascript
async function multiVersionExample() {
  // Create different versions of Node.js runtimes
  const node14 = new NodeRuntime({ version: 'v14.19.3' });
  const node16 = new NodeRuntime({ version: 'v16.15.0' });
  const node18 = new NodeRuntime({ version: 'v18.16.0' });
  
  // Install all versions
  await Promise.all([
    node14.install(),
    node16.install(),
    node18.install()
  ]);
  
  // Execute the same code across different versions
  const results = await Promise.all([
    node14.execute('return process.version;'),
    node16.execute('return process.version;'),
    node18.execute('return process.version;')
  ]);
  
  console.log("Results from different versions:", results);
}
```

## Frequently Asked Questions

### Q: How do I specify which version of Node.js to use?
A: Use the `version` parameter, e.g., `new NodeRuntime({ version: "v16.14.0" })`.

### Q: Where are Node.js binary files stored?
A: They're stored in the `node_modules/tiny-mcp-runtime-nodejs/bin` directory.

### Q: Why do I need this library instead of using Node.js installed on the system?
A: This library allows you to embed specific versions of Node.js in your application, without depending on versions installed on the user's system, while making packaging and distribution easier.

### Q: Which Node.js versions are supported?
A: Theoretically, all versions that can be downloaded from the official Node.js sources are supported. LTS versions are recommended.

## License

MIT 
