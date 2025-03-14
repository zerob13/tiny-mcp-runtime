/**
 * Runtime抽象基类
 * 定义所有运行时环境的基本接口
 */
export abstract class Runtime {
  protected runtimePath: string;
  protected installed: boolean = false;

  constructor(options: RuntimeOptions = {}) {
    this.runtimePath = options.runtimePath || "";
  }

  /**
   * 安装运行时环境
   */
  abstract install(): Promise<void>;

  /**
   * 执行命令
   * @param command 要执行的命令
   */
  abstract execute(command: string): Promise<string>;

  /**
   * 检查运行时是否已安装
   */
  isInstalled(): boolean {
    return this.installed;
  }

  /**
   * 获取运行时路径
   */
  getRuntimePath(): string {
    return this.runtimePath;
  }
}

/**
 * Runtime配置选项
 */
export interface RuntimeOptions {
  /**
   * 运行时路径，如果不提供则自动下载
   */
  runtimePath?: string;
}
