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

  /**
   * CPU 架构，默认为当前系统架构
   */
  arch?: string;

  /**
   * 平台，默认为当前系统平台
   */
  platform?: string;
}

/**
 * Node.js运行时实现
 */
export class NodeRuntime extends Runtime {
  private version: string;
  private nodeExecutable: string = "";
  private arch: string;
  private platform: string;
  // 修改默认路径到包内目录
  private readonly defaultNodeDir: string;

  constructor(options: NodeRuntimeOptions = {}) {
    super(options);
    this.version = options.version || "v22.9.0";
    this.arch = options.arch || process.arch;
    this.platform = options.platform || process.platform;

    // 默认路径是包内的bin目录
    this.defaultNodeDir = path.resolve(__dirname, "../bin");

    if (!this.runtimePath) {
      this.runtimePath = path.join(this.defaultNodeDir, this.version);
    }

    // 根据平台确定可执行文件路径
    if (this.platform === "win32") {
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

    // 构建下载URL，使用传入的架构和平台
    const platformId = this.getPlatformIdentifier();

    // 确定文件扩展名（Windows可能使用zip或7z，其他平台使用tar.gz）
    const fileExtension = this.platform === "win32" ? "zip" : "tar.gz";
    const fileName = `node-${this.version}-${platformId}.${fileExtension}`;
    const downloadUrl = `https://nodejs.org/dist/${this.version}/${fileName}`;

    const tempDir = path.join(os.tmpdir(), "tiny-mcp-runtime-temp");
    const downloadPath = path.join(tempDir, fileName);

    try {
      // 创建临时目录
      await fs.ensureDir(tempDir);

      // 确保目标目录存在
      await fs.ensureDir(this.defaultNodeDir);
      await fs.ensureDir(this.runtimePath);

      // 下载Node.js
      console.log(`正在下载 ${downloadUrl}...`);
      await Downloader.downloadFile(downloadUrl, downloadPath);

      // 解压Node.js
      console.log(`正在解压 ${downloadPath}...`);

      if (this.platform === "win32") {
        // Windows使用zip格式，需要使用不同的解压方法
        await Downloader.extractZip(downloadPath, this.defaultNodeDir);
      } else {
        // Linux和macOS使用tar.gz格式
        await Downloader.extractTarGz(downloadPath, this.defaultNodeDir);
      }

      // 处理不同平台解压后的目录结构
      const extractedDir = path.join(
        this.defaultNodeDir,
        `node-${this.version}-${platformId}`
      );
      if (await fs.pathExists(extractedDir)) {
        // 将解压出的目录移动到版本目录
        await fs.move(extractedDir, this.runtimePath, { overwrite: true });
      }

      // 设置可执行权限（仅Linux和macOS）
      if (this.platform !== "win32") {
        // 确保bin目录下的所有可执行文件都有执行权限
        const binDir = path.join(this.runtimePath, "bin");
        if (await fs.pathExists(binDir)) {
          const files = await fs.readdir(binDir);
          for (const file of files) {
            const filePath = path.join(binDir, file);
            const stats = await fs.stat(filePath);
            if (stats.isFile()) {
              await execAsync(`chmod +x "${filePath}"`);
            }
          }
        }
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

  /**
   * 获取当前系统平台的标识，用于下载对应版本
   * 与 Downloader 类中的方法类似，但使用传入的 arch 和 platform
   */
  private getPlatformIdentifier(): string {
    // 将 arch 转为字符串以避免类型错误
    const archStr = String(this.arch);

    // 针对不同平台返回对应的标识符
    if (this.platform === "darwin") {
      return archStr === "arm64" ? "darwin-arm64" : "darwin-x64";
    } else if (this.platform === "linux") {
      // 支持更多Linux架构
      if (archStr === "arm64") {
        return "linux-arm64";
      } else if (archStr === "arm" || archStr === "armv7l") {
        return "linux-armv7l";
      } else if (archStr === "ppc64" || archStr === "ppc64le") {
        return "linux-ppc64le";
      } else if (archStr === "s390" || archStr === "s390x") {
        return "linux-s390x";
      } else {
        // 默认x64架构
        return "linux-x64";
      }
    } else if (this.platform === "win32") {
      // 支持Windows的不同架构
      if (archStr === "arm64") {
        return "win-arm64";
      } else if (archStr === "ia32" || archStr === "x86") {
        return "win-x86";
      } else {
        return "win-x64";
      }
    }

    throw new Error(`不支持的平台: ${this.platform}-${archStr}`);
  }
}
