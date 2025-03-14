import axios from "axios";
import fs from "fs-extra";
import path from "path";
import tar from "tar";
import { promisify } from "util";
import { pipeline } from "stream";
import { createWriteStream } from "fs";

const pipelineAsync = promisify(pipeline);

/**
 * 下载工具类
 */
export class Downloader {
  /**
   * 从URL下载文件到指定路径
   * @param url 下载URL
   * @param destPath 目标保存路径
   */
  static async downloadFile(url: string, destPath: string): Promise<void> {
    try {
      // 确保目标目录存在
      await fs.ensureDir(path.dirname(destPath));

      // 创建写入流
      const writer = createWriteStream(destPath);

      // 发送GET请求
      const response = await axios({
        method: "GET",
        url: url,
        responseType: "stream",
      });

      // 使用pipeline将响应流写入文件
      await pipelineAsync(response.data, writer);

      console.log(`文件已下载到: ${destPath}`);
    } catch (error) {
      console.error("下载失败:", error);
      throw error;
    }
  }

  /**
   * 解压tar.gz文件
   * @param tarPath tar文件路径
   * @param destDir 解压目标目录
   */
  static async extractTarGz(tarPath: string, destDir: string): Promise<void> {
    try {
      // 确保目标目录存在
      await fs.ensureDir(destDir);

      // 解压tar.gz文件
      await tar.extract({
        file: tarPath,
        cwd: destDir,
      });

      console.log(`文件已解压到: ${destDir}`);
    } catch (error) {
      console.error("解压失败:", error);
      throw error;
    }
  }

  /**
   * 获取当前系统平台的标识，用于下载对应版本
   */
  static getPlatformIdentifier(): string {
    const platform = process.platform;
    const arch = process.arch;

    // 针对不同平台返回对应的标识符
    if (platform === "darwin") {
      return arch === "arm64" ? "darwin-arm64" : "darwin-x64";
    } else if (platform === "linux") {
      return arch === "arm64" ? "linux-arm64" : "linux-x64";
    } else if (platform === "win32") {
      return "win-x64";
    }

    throw new Error(`不支持的平台: ${platform}-${arch}`);
  }
}
