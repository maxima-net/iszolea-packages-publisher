import fs from 'fs';
import PathHelper from './path-helper';
import logger from 'electron-log';
import CommandExecutor from './command-executor';

export default class NpmPackageHelper {
  static versionRegex = /("version"\s*:\s*")(.*)(",)/;

  static getLocalPackageVersion(iszoleaUiDir: string): string | undefined {
    const packageJsonPath = PathHelper.getUiPackageJsonPath(iszoleaUiDir);
    const content = fs.readFileSync(packageJsonPath).toString();
    const parseResult = JSON.parse(content);

    if (parseResult && parseResult.version) {
      return parseResult.version;
    }

    return undefined;
  }

  static applyNewVersion(version: string, iszoleaUiDir: string): boolean {
    try {
      const packageJsonPath = PathHelper.getUiPackageJsonPath(iszoleaUiDir);
      const content = fs.readFileSync(packageJsonPath).toString();
      const newContent = content
        .replace(this.versionRegex, `$1${version}$3`);
      fs.writeFileSync(packageJsonPath, newContent);

      return true;
    }
    catch (e) {
      logger.error(e);
      return false;
    }
  }

  static async publishPackage(packageJsonDir: string): Promise<boolean> {
    return await CommandExecutor.executeCommand('npm', ['run', 'publish-please'], undefined, ['y'], packageJsonDir);
  }

  static async unPublishPackage(packageName: string, version: string): Promise<boolean> {
    return await CommandExecutor.executeCommand('npm', ['unpublish', `${packageName}@${version}`]);
  }
}
