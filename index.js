"use strict";

// 导出核心运行时与子包
module.exports = {
  // 核心运行时
  Runtime: require("./src/core/runtime").Runtime,

  // 直接导出 NodeRuntime，如果用户同时安装了 tiny-mcp-runtime-node
  get NodeRuntime() {
    try {
      return require("tiny-mcp-runtime-node").NodeRuntime;
    } catch (e) {
      console.warn("请安装 tiny-mcp-runtime-node 包来使用 NodeRuntime");
      return undefined;
    }
  },

  // 直接导出 PythonRuntime，如果用户同时安装了 tiny-mcp-runtime-python
  get PythonRuntime() {
    try {
      return require("tiny-mcp-runtime-python").PythonRuntime;
    } catch (e) {
      console.warn("请安装 tiny-mcp-runtime-python 包来使用 PythonRuntime");
      return undefined;
    }
  },
};
