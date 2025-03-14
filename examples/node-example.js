// 使用示例
const { NodeRuntime } = require("../dist/index");

async function main() {
  try {
    // 创建Node.js运行时实例
    console.log("创建Node.js运行时...");
    const runtime = new NodeRuntime();

    // 安装Node.js运行时（如果安装脚本已经运行过，这一步可能不是必需的）
    console.log("安装Node.js运行时...");
    await runtime.install();

    // 执行代码
    console.log("执行测试代码...");
    const result = await runtime.execute(`
      console.log('Hello from Node.js runtime!');
      console.log('Node.js version:', process.version);
      console.log('Platform:', process.platform);
      console.log('Architecture:', process.arch);
      return 'Execution completed!';
    `);

    console.log("执行结果:");
    console.log(result);

    // 使用自定义架构的示例
    console.log("\n使用自定义架构的示例:");
    const customArch = new NodeRuntime({
      arch: "x64",
      platform: "linux",
    });
    console.log(`自定义架构运行时路径: ${customArch.getRuntimePath()}`);

    // 使用自定义路径的示例
    console.log("\n使用自定义路径的示例:");
    const customRuntime = new NodeRuntime({
      runtimePath: "/path/to/your/custom/nodejs",
    });
    console.log(`自定义路径运行时路径: ${customRuntime.getRuntimePath()}`);
  } catch (error) {
    console.error("发生错误:", error);
  }
}

// 运行示例
main();
