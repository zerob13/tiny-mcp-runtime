// 使用示例
const { PythonRuntime } = require("tiny-mcp-runtime-python");

async function main() {
  try {
    // 创建Python运行时实例
    console.log("创建Python运行时...");
    const runtime = new PythonRuntime();

    // 安装Python运行时
    console.log("安装Python运行时...");
    await runtime.install();

    // 执行代码
    console.log("执行测试代码...");
    const result = await runtime.execute(`
import sys
import platform
import os
import json

print("Hello from Python runtime!")
print(f"Python version: {sys.version}")
print(f"Platform: {platform.system()}")
print(f"Architecture: {platform.machine()}")

# 获取系统信息
system_info = {
    'python_version': sys.version,
    'platform': platform.system(),
    'platform_version': platform.version(),
    'architecture': platform.machine(),
    'processor': platform.processor(),
    'hostname': platform.node(),
    'cpu_count': os.cpu_count()
}

print(f"System info: {json.dumps(system_info, indent=2)}")
print("Execution completed!")
    `);

    console.log("执行结果:");
    console.log(result);

    // 使用自定义架构的示例
    console.log("\n使用自定义架构的示例:");
    const customArch = new PythonRuntime({
      arch: "x64",
      platform: "linux",
      version: "3.9.0",
    });
    console.log(`自定义架构运行时路径: ${customArch.getRuntimePath()}`);

    // 使用自定义路径的示例
    console.log("\n使用自定义路径的示例:");
    const customRuntime = new PythonRuntime({
      runtimePath: "/path/to/your/custom/python",
    });
    console.log(`自定义路径运行时路径: ${customRuntime.getRuntimePath()}`);
  } catch (error) {
    console.error("发生错误:", error);
  }
}

// 运行示例
main();
