#!/usr/bin/env node

"use strict";

// 此脚本在npm install完成后自动执行，用于初始化Node.js运行时环境

// 如果存在CI环境或用户明确设置了跳过安装的环境变量，则跳过安装
if (process.env.CI === "true" || process.env.TINY_MCP_SKIP_INSTALL === "true") {
  console.log(
    "检测到CI环境或TINY_MCP_SKIP_INSTALL=true，跳过Node.js运行时安装"
  );
  process.exit(0);
}

// 获取 npm 配置的目标架构和平台
function getNpmConfig() {
  // 读取 npm_config 环境变量
  const arch = process.env.npm_config_arch || process.arch;
  const platform = process.env.npm_config_platform || process.platform;

  console.log(`目标架构: ${arch}, 目标平台: ${platform}`);

  return { arch, platform };
}

// 确保 bin 目录存在
const fs = require("fs");
const path = require("path");
const binDir = path.resolve(__dirname, "../bin");

if (!fs.existsSync(binDir)) {
  fs.mkdirSync(binDir, { recursive: true });
}

// 延迟加载，确保所有依赖已经正确安装
setTimeout(() => {
  try {
    const { NodeRuntime } = require("../dist/index");
    const { arch, platform } = getNpmConfig();

    console.log(`开始安装 Node.js 运行时 (${platform}-${arch})...`);

    // 创建运行时实例，传入 npm 配置的架构和平台
    const runtime = new NodeRuntime({
      arch: arch,
      platform: platform,
    });

    // 执行安装
    runtime
      .install()
      .then(() => {
        console.log("Node.js运行时安装成功！");
      })
      .catch((error) => {
        console.error("Node.js运行时安装失败:", error);
        // 不需要退出进程，因为这不是致命错误，用户仍然可以手动安装
      });
  } catch (error) {
    console.error("初始化失败:", error);
    // 不需要退出进程，因为这不是致命错误
  }
}, 1000); // 给依赖加载一些时间
