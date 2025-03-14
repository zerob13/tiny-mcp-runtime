// Linux 平台示例
const { NodeRuntime } = require("tiny-mcp-runtime-nodejs");

async function main() {
  try {
    console.log("Linux平台 Node.js 运行时示例");

    // 创建 Linux 平台的 Node.js 运行时实例
    console.log("为不同Linux架构创建Node.js运行时...");

    // 1. x64 架构 (最常见)
    const x64Runtime = new NodeRuntime({
      arch: "x64",
      platform: "linux",
    });
    console.log(`Linux x64 运行时路径: ${x64Runtime.getRuntimePath()}`);

    // 2. arm64 架构 (如 树莓派4等ARM64设备)
    const arm64Runtime = new NodeRuntime({
      arch: "arm64",
      platform: "linux",
    });
    console.log(`Linux arm64 运行时路径: ${arm64Runtime.getRuntimePath()}`);

    // 3. armv7l 架构 (如 树莓派3等较老的ARM设备)
    const armv7Runtime = new NodeRuntime({
      arch: "armv7l",
      platform: "linux",
    });
    console.log(`Linux armv7l 运行时路径: ${armv7Runtime.getRuntimePath()}`);

    // 4. ppc64le 架构 (IBM Power系统)
    const ppcRuntime = new NodeRuntime({
      arch: "ppc64le",
      platform: "linux",
    });
    console.log(`Linux ppc64le 运行时路径: ${ppcRuntime.getRuntimePath()}`);

    // 5. s390x 架构 (IBM Z系统)
    const s390xRuntime = new NodeRuntime({
      arch: "s390x",
      platform: "linux",
    });
    console.log(`Linux s390x 运行时路径: ${s390xRuntime.getRuntimePath()}`);

    // 安装并使用其中一个运行时 (这里以 x64 为例)
    console.log("\n安装 Linux x64 Node.js 运行时...");
    await x64Runtime.install();

    // 执行代码
    console.log("在 Linux x64 运行时上执行测试代码...");
    const result = await x64Runtime.execute(`
      console.log('Hello from Linux Node.js runtime!');
      console.log('Node.js version:', process.version);
      console.log('Platform:', process.platform);
      console.log('Architecture:', process.arch);
      const os = require('os');
      console.log('系统信息:', {
        hostname: os.hostname(),
        type: os.type(),
        platform: os.platform(),
        arch: os.arch(),
        release: os.release(),
        cpus: os.cpus().length
      });
      return 'Linux 执行完成!';
    `);

    console.log("执行结果:");
    console.log(result);
  } catch (error) {
    console.error("发生错误:", error);
  }
}

// 运行示例
main();
