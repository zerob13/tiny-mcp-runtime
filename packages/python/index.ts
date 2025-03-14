import { Runtime, RuntimeOptions } from "../../src/core/runtime";
import { Downloader } from "../../src/utils/download";
import path from "path";
import fs from "fs-extra";
import { exec } from "child_process";
import { promisify } from "util";
import os from "os";

const execAsync = promisify(exec);

/**
 * Python运行时配置选项
 */
export interface PythonRuntimeOptions extends RuntimeOptions {
  /**
   * Python版本，默认为3.10.0
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
 * Python运行时实现
 */
export class PythonRuntime extends Runtime {
  private version: string;
  private pythonExecutable: string = "";
  private arch: string;
  private platform: string;
  // 默认路径到包内目录
  private readonly defaultPythonDir: string;

  constructor(options: PythonRuntimeOptions = {}) {
    super(options);
    this.version = options.version || "3.10.0";
    this.arch = options.arch || process.arch;
    this.platform = options.platform || process.platform;

    // 默认路径是包内的bin目录
    this.defaultPythonDir = path.resolve(__dirname, "../bin");

    if (!this.runtimePath) {
      this.runtimePath = path.join(this.defaultPythonDir, this.version);
    }

    // 根据平台确定可执行文件路径
    if (this.platform === "win32") {
      this.pythonExecutable = path.join(this.runtimePath, "python.exe");
    } else {
      this.pythonExecutable = path.join(this.runtimePath, "bin", "python3");
    }
  }

  /**
   * 安装Python运行时
   */
  async install(): Promise<void> {
    // 如果已安装，直接返回
    if (await this.checkPythonInstalled()) {
      console.log(`Python ${this.version} 已安装`);
      this.installed = true;
      return;
    }

    console.log(`开始安装 Python ${this.version}...`);

    // 构建下载URL，使用传入的架构和平台
    const platformId = this.getPlatformIdentifier();
    const fileName = this.getDownloadFileName(platformId);
    const downloadUrl = this.getDownloadUrl(fileName);

    const tempDir = path.join(os.tmpdir(), "tiny-mcp-runtime-temp");
    const downloadPath = path.join(tempDir, fileName);

    try {
      // 创建临时目录
      await fs.ensureDir(tempDir);

      // 确保目标目录存在
      await fs.ensureDir(this.defaultPythonDir);
      await fs.ensureDir(this.runtimePath);

      // 下载Python
      console.log(`正在下载 ${downloadUrl}...`);
      await Downloader.downloadFile(downloadUrl, downloadPath);

      // 解压Python
      console.log(`正在解压 ${downloadPath}...`);

      // 根据文件类型选择解压方法
      if (fileName.endsWith(".zip")) {
        await Downloader.extractZip(downloadPath, this.runtimePath);
      } else if (fileName.endsWith(".tar.gz") || fileName.endsWith(".tgz")) {
        await Downloader.extractTarGz(downloadPath, this.runtimePath);
      } else {
        throw new Error(`不支持的文件格式: ${fileName}`);
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

      console.log(`Python ${this.version} 安装成功`);
      this.installed = true;
    } catch (error) {
      console.error("安装失败:", error);
      throw error;
    }
  }

  /**
   * 执行Python命令
   * @param command 要执行的Python代码
   */
  async execute(command: string): Promise<string> {
    if (!this.installed && !(await this.checkPythonInstalled())) {
      throw new Error("Python 运行时未安装，请先调用 install() 方法");
    }

    try {
      // 创建临时Python文件
      const scriptPath = path.join(
        os.tmpdir(),
        `tiny-mcp-runtime-${Date.now()}.py`
      );
      await fs.writeFile(scriptPath, command);

      // 执行命令
      const { stdout, stderr } = await execAsync(
        `"${this.pythonExecutable}" "${scriptPath}"`
      );

      // 删除临时文件
      await fs.remove(scriptPath);

      if (stderr && stderr.length > 0) {
        console.warn("执行警告:", stderr);
      }

      return stdout;
    } catch (error) {
      console.error("执行失败:", error);
      throw error;
    }
  }

  /**
   * 检查Python是否已安装
   */
  private async checkPythonInstalled(): Promise<boolean> {
    if (!this.runtimePath || !(await fs.pathExists(this.runtimePath))) {
      return false;
    }

    if (!(await fs.pathExists(this.pythonExecutable))) {
      return false;
    }

    try {
      // 尝试执行python --version 检查是否能正常运行
      const { stdout } = await execAsync(
        `"${this.pythonExecutable}" --version`
      );
      const versionOutput = stdout.trim();

      // 检查版本是否匹配 (Python 3.10.0 这样的输出)
      if (versionOutput.includes(this.version)) {
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
   */
  private getPlatformIdentifier(): string {
    // 将 arch 转为字符串以避免类型错误
    const archStr = String(this.arch);

    // 针对不同平台返回对应的标识符
    if (this.platform === "darwin") {
      return archStr === "arm64" ? "macos-arm64" : "macos-x64";
    } else if (this.platform === "linux") {
      // Linux支持
      if (archStr === "arm64") {
        return "linux-aarch64";
      } else if (archStr === "arm" || archStr === "armv7l") {
        return "linux-armv7l";
      } else {
        // 默认x64架构
        return "linux-x64";
      }
    } else if (this.platform === "win32") {
      // Windows支持
      if (archStr === "arm64") {
        return "win-arm64";
      } else if (archStr === "ia32" || archStr === "x86") {
        return "win-x86";
      } else {
        return "win-amd64";
      }
    }

    throw new Error(`不支持的平台: ${this.platform}-${archStr}`);
  }

  /**
   * 获取对应版本和平台的下载文件名
   */
  private getDownloadFileName(platformId: string): string {
    // 根据版本和平台构建文件名
    const versionWithoutV = this.version.startsWith("v")
      ? this.version.substring(1)
      : this.version;

    // Python的文件名格式根据平台有所不同
    if (this.platform === "win32") {
      // Windows使用zip格式
      return `python-${versionWithoutV}-embed-${platformId}.zip`;
    } else if (this.platform === "darwin") {
      // macOS使用tar.gz格式
      return `python-${versionWithoutV}-${platformId}.tar.gz`;
    } else {
      // Linux使用tar.gz格式
      return `python-${versionWithoutV}-${platformId}.tar.gz`;
    }
  }

  /**
   * 获取下载URL
   */
  private getDownloadUrl(fileName: string): string {
    // Python的下载URL可能因版本和平台而异
    // 这里使用官方的Python下载URL，也可以替换为镜像站点
    const versionWithoutV = this.version.startsWith("v")
      ? this.version.substring(1)
      : this.version;

    const majorMinor = versionWithoutV.split(".").slice(0, 2).join(".");

    // 根据平台返回不同的下载URL
    if (this.platform === "win32") {
      return `https://www.python.org/ftp/python/${versionWithoutV}/python-${versionWithoutV}-embed-${
        this.arch === "x64" ? "amd64" : this.arch
      }.zip`;
    } else {
      // Linux和macOS
      return `https://www.python.org/ftp/python/${versionWithoutV}/${fileName}`;
    }
  }
}
