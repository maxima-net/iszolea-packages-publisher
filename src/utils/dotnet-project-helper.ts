import fs from 'fs';
import PathHelper from './path-helper';
import CommandExecutor from './command-executor';
import logger from 'electron-log';

export default class DotNetProjectHelper {
  static versionRegex = /(<Version>)(.*)(<\/Version>)/;
  static assemblyVersionRegex = /(<AssemblyVersion>)(.*)(<\/AssemblyVersion>)/;
  static fileVersionRegex = /(<FileVersion>)(.*)(<\/FileVersion>)/;

  static getLocalPackageVersion(slnPath: string, packageName: string): string | undefined {
    const csProjPath = PathHelper.getProjectFilePath(slnPath, packageName);
    const content = fs.readFileSync(csProjPath).toString();

    const parseResult = DotNetProjectHelper.versionRegex.exec(content);

    if (parseResult && parseResult.length >= 3) {
      return parseResult[2];
    }

    return undefined;
  }

  static getLocalAssemblyVersion(slnPath: string, packageName: string): string | undefined {
    const csProjPath = PathHelper.getProjectFilePath(slnPath, packageName);
    const content = fs.readFileSync(csProjPath).toString();

    const parseResult = DotNetProjectHelper.assemblyVersionRegex.exec(content);

    if (parseResult && parseResult.length >= 3) {
      return parseResult[2];
    }

    return undefined;
  }

  static applyNewVersion(version: string, assemblyAndFileVersion: string, slnPath: string, packageName: string): boolean {
    try {
      const csProjPath = PathHelper.getProjectFilePath(slnPath, packageName);
      const content = fs.readFileSync(csProjPath).toString();
      const newContent = content
        .replace(DotNetProjectHelper.versionRegex, `$1${version}$3`)
        .replace(DotNetProjectHelper.assemblyVersionRegex, `$1${assemblyAndFileVersion}$3`)
        .replace(DotNetProjectHelper.fileVersionRegex, `$1${assemblyAndFileVersion}$3`);
      fs.writeFileSync(csProjPath, newContent);

      return true;
    }
    catch (e) {
      logger.error(e);
      return false;
    }
  }

  static async build(projectFilePath: string): Promise<boolean> {
    return CommandExecutor.executeCommand('dotnet', ['build', projectFilePath, '-c', 'Release',
      '--output', 'bin/Release', '--verbosity', 'quiet']);
  }

  static async checkCommandsAvailability(): Promise<boolean> {
    return CommandExecutor.executeCommand('dotnet', ['--info']);
  }
}
