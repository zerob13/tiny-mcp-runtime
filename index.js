"use strict";

// 导出核心运行时
module.exports = {
  Runtime: require("./src/core/runtime").Runtime,
  NodeRuntime: require("./packages/node/index").NodeRuntime,
  // PythonRuntime: require("./packages/python/index").PythonRuntime,
};
