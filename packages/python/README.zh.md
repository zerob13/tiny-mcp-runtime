# tiny-mcp-runtime-python

<div align="center">
  中文 / <a href="./README.md">English</a>
</div>

Python 运行时管理库 - 自动下载、安装和执行指定版本的 Python 运行时环境。

## 介绍

`tiny-mcp-runtime-python` 是一个用于管理 Python 运行时环境的库，它能够自动下载并安装指定版本的 Python，并提供简单的 API 来执行 Python 代码。该库是 `tiny-mcp-runtime` 生态系统的一部分，专为 Electron 应用和其他需要嵌入式 Python 运行时的场景设计。

## ⚠️ 当前实现限制

**重要提示**：目前，本库仅在 Windows 平台上完全实现和测试。

- **Windows**：完全支持，使用 Python 官方提供的可嵌入版本
- **macOS 和 Linux**：目前**尚未完全实现**

这是因为 Python 官方只为 Windows 平台提供了可嵌入版本（embeddable zip package）。对于 macOS 和 Linux，需要额外的步骤来创建类似的嵌入式版本。

### 可能的解决方案（欢迎贡献 PR）

为 macOS 和 Linux 平台实现此功能的可能方法包括：

1. 使用 Python 构建工具（如 PyInstaller）创建独立的 Python 运行时
2. 从官方安装包中提取必要的文件并创建自定义的嵌入式分发版
3. 使用 conda/miniconda 创建隔离的环境并打包
4. 为特定平台开发安装脚本，确保正确处理库依赖

## 特性

- **自动安装**：一键安装指定版本的 Python
- **灵活配置**：支持自定义版本和路径
- **内置版本管理**：自动处理不同版本的 Python
- **打包友好**：将 Python 安装在 node_modules 目录中，便于打包
- **多平台支持**：设计上支持 Windows、macOS 和 Linux（但目前主要为 Windows 实现）
- **多架构支持**：支持 x64、arm64 等多种 CPU 架构

## 安装

```bash
# 基本安装
npm install tiny-mcp-runtime-python

# 指定目标架构和平台
npm install tiny-mcp-runtime-python --arch=arm64 --platform=win32
```

## 快速入门

```javascript
const { PythonRuntime } = require('tiny-mcp-runtime-python');

// 创建 Python 运行时实例（默认版本为 3.10.0）
const runtime = new PythonRuntime();

// 安装 Python 运行时（如果已安装会跳过）
await runtime.install();

// 执行 Python 代码
const result = await runtime.execute(`
import sys
print(f"Hello from Python {sys.version}!")
`);

console.log(result); // 输出 Python 执行结果
```

## 配置选项

### 指定版本

```javascript
// 使用特定版本的 Python
const runtime = new PythonRuntime({ version: "3.9.0" });
```

### 指定架构

```javascript
// 为特定架构安装 Python
const runtime = new PythonRuntime({ arch: "arm64" });
```

### 自定义安装路径

```javascript
// 使用自定义路径的 Python
const runtime = new PythonRuntime({ 
  runtimePath: "/path/to/custom/python" 
});
```

## API 参考

### `PythonRuntime` 类

#### 构造函数

```javascript
new PythonRuntime(options)
```

**参数**:
- `options` (可选): 配置对象
  - `version` (字符串，可选): Python 版本，如 "3.10.0"。默认为 "3.10.0"
  - `runtimePath` (字符串，可选): 自定义 Python 运行时路径
  - `arch` (字符串，可选): 目标架构，如 "x64", "arm64"
  - `platform` (字符串，可选): 目标平台，如 "win32", "darwin", "linux"

#### 方法

##### `install()`

安装 Python 运行时。

**返回值**: Promise<void>

##### `execute(command)`

执行 Python 代码并返回结果。

**参数**:
- `command` (字符串): 要执行的 Python 代码

**返回值**: Promise<string> - 执行结果

##### `isInstalled()`

检查 Python 运行时是否已安装。

**返回值**: Promise<boolean>

##### `getRuntimePath()`

获取 Python 运行时的完整路径。

**返回值**: string

## 环境变量

- `TINY_MCP_SKIP_INSTALL=true`: 跳过自动安装 Python 运行时

## 支持的平台和架构

- **Windows**: amd64, arm64, x86（完全支持）
- **macOS**: arm64, x64（正在开发中）
- **Linux**: x64, arm64, armv7l（正在开发中）

## 使用示例

### 数据处理示例

```javascript
await runtime.execute(`
import json
import math

# 简单数据处理
data = [1, 2, 3, 4, 5]
result = {
    "sum": sum(data),
    "average": sum(data) / len(data),
    "standard_deviation": math.sqrt(sum((x - (sum(data) / len(data))) ** 2 for x in data) / len(data))
}

print(json.dumps(result))
`);
```

### 科学计算示例

```javascript
// 如果目标环境中有 NumPy, SciPy 等包
await runtime.execute(`
try:
    import numpy as np
    
    # 创建一个简单的矩阵并执行操作
    matrix = np.array([[1, 2], [3, 4]])
    determinant = np.linalg.det(matrix)
    eigenvalues = np.linalg.eigvals(matrix)
    
    print(f"Determinant: {determinant}")
    print(f"Eigenvalues: {eigenvalues}")
except ImportError:
    print("NumPy not available in this environment")
`);
```

### 在 Electron 应用中使用

```javascript
// 在 Electron 主进程或渲染进程中
const { PythonRuntime } = require('tiny-mcp-runtime-python');

// 初始化 Python 运行时
const pythonRuntime = new PythonRuntime();
await pythonRuntime.install();

// 处理用户请求
ipcMain.handle('execute-python', async (event, code) => {
  try {
    const result = await pythonRuntime.execute(code);
    return { success: true, result };
  } catch (error) {
    return { success: false, error: error.message };
  }
});
```

### 管理多个 Python 版本

```javascript
// 创建两个不同版本的 Python 运行时
const python39 = new PythonRuntime({ version: "3.9.0" });
const python310 = new PythonRuntime({ version: "3.10.0" });

// 安装两个版本
await Promise.all([
  python39.install(),
  python310.install()
]);

// 在两个版本中执行相同的代码
const result39 = await python39.execute('import sys; print(sys.version)');
const result310 = await python310.execute('import sys; print(sys.version)');

console.log('Python 3.9:', result39);
console.log('Python 3.10:', result310);
```

## 如何贡献

我们非常欢迎社区贡献，特别是以下方面：

1. **macOS 和 Linux 支持**：帮助实现 macOS 和 Linux 平台上的 Python 嵌入式版本支持
2. **增强功能**：添加更多 Python 相关功能，如包管理、虚拟环境支持等
3. **测试和文档**：改进测试覆盖率和文档

如果您有兴趣贡献代码：

1. Fork 仓库
2. 创建您的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交您的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启一个 Pull Request

## 常见问题

### Q: 如何指定使用特定版本的 Python？
A: 使用 `version` 参数，例如 `new PythonRuntime({ version: "3.9.0" })`。

### Q: Python 二进制文件存储在哪里？
A: 存储在 `node_modules/tiny-mcp-runtime-python/bin` 目录下。

### Q: 如何安装额外的 Python 包？
A: 目前库不直接支持包管理。对于 Windows，您可以手动安装包到嵌入式 Python 中，或者在代码中使用 `pip` 的 API。

### Q: 为什么 macOS 和 Linux 平台不能使用？
A: Python 官方仅为 Windows 提供了可嵌入式版本。对于 macOS 和 Linux，需要额外的步骤来创建类似的嵌入式版本，目前这部分功能尚在开发中。我们欢迎社区贡献。

## 许可证

MIT 
