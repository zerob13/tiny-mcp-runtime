# tiny-mcp-runtime-python

<div align="center">
  <a href="./README.zh.md">中文</a> / English
</div>

Python Runtime Management Library - Automatically download, install, and execute specified versions of Python runtime environment.

## Introduction

`tiny-mcp-runtime-python` is a library for managing Python runtime environments, capable of automatically downloading and installing specified versions of Python and providing a simple API to execute Python code. This library is part of the `tiny-mcp-runtime` ecosystem, specially designed for Electron applications and other scenarios requiring embedded Python runtimes.

## ⚠️ Current Implementation Limitations

**Important Note**: Currently, this library is fully implemented and tested only on Windows platform.

- **Windows**: Fully supported, using the official Python embeddable version
- **macOS and Linux**: Currently **not fully implemented**

This is because Python officials only provide embeddable versions (embeddable zip packages) for the Windows platform. For macOS and Linux, additional steps are required to create similar embedded versions.

### Possible Solutions (PR Contributions Welcome)

Possible approaches to implement this functionality for macOS and Linux platforms include:

1. Using Python build tools (like PyInstaller) to create standalone Python runtimes
2. Extracting necessary files from official installation packages and creating custom embeddable distributions
3. Using conda/miniconda to create isolated environments and package them
4. Developing installation scripts for specific platforms, ensuring proper handling of library dependencies

## Features

- **Automatic Installation**: One-click installation of specified Python versions
- **Flexible Configuration**: Support for custom versions and paths
- **Built-in Version Management**: Automatic handling of different Python versions
- **Packaging Friendly**: Installing Python in the node_modules directory for easy packaging
- **Multi-platform Support**: Designed to support Windows, macOS, and Linux (but currently mainly implemented for Windows)
- **Multi-architecture Support**: Support for various CPU architectures including x64, arm64

## Installation

```bash
# Basic Installation
npm install tiny-mcp-runtime-python

# Specify target architecture and platform
npm install tiny-mcp-runtime-python --arch=arm64 --platform=win32
```

## Quick Start

```javascript
const { PythonRuntime } = require('tiny-mcp-runtime-python');

// Create Python runtime instance (default version is 3.10.0)
const runtime = new PythonRuntime();

// Install Python runtime (skips if already installed)
await runtime.install();

// Execute Python code
const result = await runtime.execute(`
import sys
print(f"Hello from Python {sys.version}!")
`);

console.log(result); // Output Python execution result
```

## Configuration Options

### Specify Version

```javascript
// Use a specific Python version
const runtime = new PythonRuntime({ version: "3.9.0" });
```

### Specify Architecture

```javascript
// Install Python for a specific architecture
const runtime = new PythonRuntime({ arch: "arm64" });
```

### Custom Installation Path

```javascript
// Use Python from a custom path
const runtime = new PythonRuntime({ 
  runtimePath: "/path/to/custom/python" 
});
```

## API Reference

### `PythonRuntime` Class

#### Constructor

```javascript
new PythonRuntime(options)
```

**Parameters**:
- `options` (optional): Configuration object
  - `version` (string, optional): Python version, e.g. "3.10.0". Defaults to "3.10.0"
  - `runtimePath` (string, optional): Custom Python runtime path
  - `arch` (string, optional): Target architecture, e.g. "x64", "arm64"
  - `platform` (string, optional): Target platform, e.g. "win32", "darwin", "linux"

#### Methods

##### `install()`

Install the Python runtime.

**Returns**: Promise<void>

##### `execute(command)`

Execute Python code and return the result.

**Parameters**:
- `command` (string): Python code to execute

**Returns**: Promise<string> - Execution result

##### `isInstalled()`

Check if the Python runtime is installed.

**Returns**: Promise<boolean>

##### `getRuntimePath()`

Get the full path to the Python runtime.

**Returns**: string

## Environment Variables

- `TINY_MCP_SKIP_INSTALL=true`: Skip automatic Python runtime installation

## Supported Platforms and Architectures

- **Windows**: amd64, arm64, x86 (fully supported)
- **macOS**: arm64, x64 (under development)
- **Linux**: x64, arm64, armv7l (under development)

## Usage Examples

### Data Processing Example

```javascript
await runtime.execute(`
import json
import math

# Simple data processing
data = [1, 2, 3, 4, 5]
result = {
    "sum": sum(data),
    "average": sum(data) / len(data),
    "standard_deviation": math.sqrt(sum((x - (sum(data) / len(data))) ** 2 for x in data) / len(data))
}

print(json.dumps(result))
`);
```

### Scientific Computing Example

```javascript
// If NumPy, SciPy, etc. are available in the target environment
await runtime.execute(`
try:
    import numpy as np
    
    # Create a simple matrix and perform operations
    matrix = np.array([[1, 2], [3, 4]])
    determinant = np.linalg.det(matrix)
    eigenvalues = np.linalg.eigvals(matrix)
    
    print(f"Determinant: {determinant}")
    print(f"Eigenvalues: {eigenvalues}")
except ImportError:
    print("NumPy not available in this environment")
`);
```

### Using in Electron Applications

```javascript
// In Electron main or renderer process
const { PythonRuntime } = require('tiny-mcp-runtime-python');

// Initialize Python runtime
const pythonRuntime = new PythonRuntime();
await pythonRuntime.install();

// Handle user requests
ipcMain.handle('execute-python', async (event, code) => {
  try {
    const result = await pythonRuntime.execute(code);
    return { success: true, result };
  } catch (error) {
    return { success: false, error: error.message };
  }
});
```

### Managing Multiple Python Versions

```javascript
// Create two different Python runtime versions
const python39 = new PythonRuntime({ version: "3.9.0" });
const python310 = new PythonRuntime({ version: "3.10.0" });

// Install both versions
await Promise.all([
  python39.install(),
  python310.install()
]);

// Execute the same code in both versions
const result39 = await python39.execute('import sys; print(sys.version)');
const result310 = await python310.execute('import sys; print(sys.version)');

console.log('Python 3.9:', result39);
console.log('Python 3.10:', result310);
```

## How to Contribute

We greatly welcome community contributions, especially in the following areas:

1. **macOS and Linux Support**: Help implement Python embeddable version support on macOS and Linux platforms
2. **Enhanced Features**: Add more Python-related features such as package management, virtual environment support, etc.
3. **Testing and Documentation**: Improve test coverage and documentation

If you're interested in contributing code:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Frequently Asked Questions

### Q: How do I specify a particular Python version?
A: Use the `version` parameter, e.g., `new PythonRuntime({ version: "3.9.0" })`.

### Q: Where are the Python binary files stored?
A: They're stored in the `node_modules/tiny-mcp-runtime-python/bin` directory.

### Q: How do I install additional Python packages?
A: The library doesn't directly support package management currently. For Windows, you can manually install packages into the embeddable Python or use `pip` API in your code.

### Q: Why doesn't Python work on macOS and Linux?
A: Python officials only provide embeddable versions for Windows. For macOS and Linux, additional steps are required to create similar embedded versions, and this functionality is still under development. We welcome community contributions.

## License

MIT 
