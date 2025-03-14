import { Runtime, RuntimeOptions } from "../../src/core/runtime";
import { Downloader } from "../../src/utils/download";
import path from "path";
import fs from "fs-extra";
import { exec } from "child_process";
import { promisify } from "util";
import os from "os";

const execAsync = promisify(exec);

/**
 * Node.js运行时配置选项
 */
export interface NodeRuntimeOptions extends RuntimeOptions {
  /**
   * Node.js版本，默认为v22.9.0
   */
  version?: string;
}

/**
 * Node.js运行时实现
 */
export class NodeRuntime extends Runtime {
  private version: string;
  private nodeExecutable: string = "";
  private readonly defaultNodeDir = path.join(
    os.homedir(),
    ".tiny-mcp-runtime",
    "node"
  );

  constructor(options: NodeRuntimeOptions = {}) {
    super(options);
    this.version = options.version || "v22.9.0";

    if (!this.runtimePath) {
      this.runtimePath = path.join(this.defaultNodeDir, this.version);
    }

    // 确定node可执行文件的路径
    const platform = process.platform;
    if (platform === "win32") {
      this.nodeExecutable = path.join(this.runtimePath, "node.exe");
    } else {
      this.nodeExecutable = path.join(this.runtimePath, "bin", "node");
    }
  }

  /**
   * 安装Node.js运行时
   */
  async install(): Promise<void> {
    // 如果已安装，直接返回
    if (await this.checkNodeInstalled()) {
      console.log(`Node.js ${this.version} 已安装`);
      this.installed = true;
      return;
    }

    console.log(`开始安装 Node.js ${this.version}...`);

    // 构建下载URL
    const platformId = Downloader.getPlatformIdentifier();
    const fileName = `node-${this.version}-${platformId}.tar.gz`;
    const downloadUrl = `https://nodejs.org/dist/${this.version}/${fileName}`;

    const tempDir = path.join(os.tmpdir(), "tiny-mcp-runtime-temp");
    const downloadPath = path.join(tempDir, fileName);

    try {
      // 创建临时目录
      await fs.ensureDir(tempDir);

      // 下载Node.js
      console.log(`正在下载 ${downloadUrl}...`);
      await Downloader.downloadFile(downloadUrl, downloadPath);

      // 解压Node.js
      console.log(`正在解压 ${downloadPath}...`);
      await fs.ensureDir(this.runtimePath);
      await Downloader.extractTarGz(downloadPath, this.defaultNodeDir);

      // 处理不同平台解压后的目录结构
      const extractedDir = path.join(
        this.defaultNodeDir,
        `node-${this.version}-${platformId}`
      );
      if (await fs.pathExists(extractedDir)) {
        // 将解压出的目录移动到版本目录
        await fs.move(extractedDir, this.runtimePath, { overwrite: true });
      }

      // 设置可执行权限
      if (process.platform !== "win32") {
        await execAsync(`chmod +x ${this.nodeExecutable}`);
      }

      // 清理临时文件
      await fs.remove(downloadPath);

      console.log(`Node.js ${this.version} 安装成功`);
      this.installed = true;
    } catch (error) {
      console.error("安装失败:", error);
      throw error;
    }
  }

  /**
   * 执行Node.js命令
   * @param command 要执行的命令
   */
  async execute(command: string): Promise<string> {
    if (!this.installed && !(await this.checkNodeInstalled())) {
      throw new Error("Node.js 运行时未安装，请先调用 install() 方法");
    }

    try {
      // 创建临时JS文件
      const scriptPath = path.join(
        os.tmpdir(),
        `tiny-mcp-runtime-${Date.now()}.js`
      );
      await fs.writeFile(scriptPath, command);

      // 执行命令
      const { stdout, stderr } = await execAsync(
        `"${this.nodeExecutable}" "${scriptPath}"`
      );

      // 删除临时文件
      await fs.remove(scriptPath);

      if (stderr) {
        console.warn("执行警告:", stderr);
      }

      return stdout;
    } catch (error) {
      console.error("执行失败:", error);
      throw error;
    }
  }

  /**
   * 检查Node.js是否已安装
   */
  private async checkNodeInstalled(): Promise<boolean> {
    if (!this.runtimePath || !(await fs.pathExists(this.runtimePath))) {
      return false;
    }

    if (!(await fs.pathExists(this.nodeExecutable))) {
      return false;
    }

    try {
      // 尝试执行node -v 检查是否能正常运行
      const { stdout } = await execAsync(`"${this.nodeExecutable}" -v`);
      const version = stdout.trim();

      // 检查版本是否匹配
      if (version === this.version) {
        this.installed = true;
        return true;
      }
    } catch (error) {
      return false;
    }

    return false;
  }
}
