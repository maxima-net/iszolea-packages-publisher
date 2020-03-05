import fs from 'fs';
import path from 'path';
import { executeCommand } from './command-executor';
import logger from 'electron-log';

export default class DotNetProject {
  private readonly VERSION_REGEX = /(<Version>)(.*)(<\/Version>)/;
  private readonly ASSEMBLY_VERSION_REGEX = /(<AssemblyVersion>)(.*)(<\/AssemblyVersion>)/;
  private readonly FILE_VERSION_REGEX = /(<FileVersion>)(.*)(<\/FileVersion>)/;

  private readonly projectFilePath: string;

  constructor(projectFilePath: string) {
    this.projectFilePath = projectFilePath;
  }

  getPackageVersion(): string | undefined {
    const content = fs.readFileSync(this.projectFilePath).toString();
    const parseResult = this.VERSION_REGEX.exec(content);

    if (parseResult && parseResult.length >= 3) {
      return parseResult[2];
    }

    return undefined;
  }

  applyNewVersion(version: string, assemblyAndFileVersion: string): boolean {
    try {
      const content = fs.readFileSync(this.projectFilePath).toString();
      const newContent = content
        .replace(this.VERSION_REGEX, `$1${version}$3`)
        .replace(this.ASSEMBLY_VERSION_REGEX, `$1${assemblyAndFileVersion}$3`)
        .replace(this.FILE_VERSION_REGEX, `$1${assemblyAndFileVersion}$3`);

      fs.writeFileSync(this.projectFilePath, newContent);

      return true;
    }
    catch (e) {
      logger.error(e);
      return false;
    }
  }

  async build(): Promise<boolean> {
    const outPath = path.join(path.dirname(this.projectFilePath), 'bin/Release');

    const result = await executeCommand({
      command: 'dotnet',
      args: ['build', this.projectFilePath, '-c', 'Release', '--output', outPath, '--verbosity', 'quiet']
    });

    return result.isSuccess;
  }
}
