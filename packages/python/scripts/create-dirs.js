#!/usr/bin/env node

"use strict";

// 这个脚本在发布包前执行，确保所需的目录结构已经存在

const fs = require("fs");
const path = require("path");

// 确保bin目录存在
const binDir = path.resolve(__dirname, "../bin");
if (!fs.existsSync(binDir)) {
  console.log("创建bin目录...");
  fs.mkdirSync(binDir, { recursive: true });
}

// 创建一个占位文件，确保空目录能被发布
const placeholderFile = path.join(binDir, ".gitkeep");
if (!fs.existsSync(placeholderFile)) {
  console.log("创建占位文件...");
  fs.writeFileSync(placeholderFile, "# 此目录用于存放下载的Python二进制文件\n");
}

console.log("目录结构准备完成");
