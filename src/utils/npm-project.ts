import fs from 'fs';
import { getUiPackageJsonPath } from './path';
import logger from 'electron-log';
import { executeCommand } from './command-executor';

export default class NpmProject {
  private readonly VERSION_REGEX = /("version"\s*:\s*")(.*)(",)/;

  private readonly projectDirPath: string;
  private readonly packageJsonPath: string;

  constructor(projectDirPath: string) {
    this.projectDirPath = projectDirPath;
    this.packageJsonPath = getUiPackageJsonPath(this.projectDirPath);
  }

  getPackageVersion(): string | undefined {
    const content = fs.readFileSync(this.packageJsonPath).toString();
    const parseResult = JSON.parse(content);

    if (parseResult && parseResult.version) {
      return parseResult.version;
    }

    return undefined;
  }

  applyNewVersion(version: string): boolean {
    try {
      const content = fs.readFileSync(this.packageJsonPath).toString();
      const newContent = content
        .replace(this.VERSION_REGEX, `$1${version}$3`);
      fs.writeFileSync(this.packageJsonPath, newContent);

      return true;
    }
    catch (e) {
      logger.error(e);
      return false;
    }
  }

  async publishPackage(npmAutoLogin: boolean, npmLogin: string, npmPassword: string, npmEmail: string): Promise<boolean> {
    const loginResult = npmAutoLogin
      ? await this.login(npmLogin, npmPassword, npmEmail)
      : true;

    if (!loginResult) {
      return false;
    }

    const result = await executeCommand({ command: 'npm', args: ['run', 'publish-please'], stdinCommands: ['y'], cwd: this.projectDirPath });
    return result.isSuccess;
  }

  async unPublishPackage(packageName: string, version: string): Promise<boolean> {
    const result = await executeCommand({ command: 'npm', args: ['unpublish', `${packageName}@${version}`] });
    return result.isSuccess;
  }

  private async login(npmLogin: string, npmPassword: string, npmEmail: string): Promise<boolean> {
    const result = await executeCommand({ command: 'npm', args: ['login'], stdinCommands: [npmLogin, npmPassword, npmEmail] });
    return result.isSuccess;
  }
}
