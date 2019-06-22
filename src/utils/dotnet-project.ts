import fs from 'fs';
import { getProjectFilePath } from './path';
import { executeCommand } from './command-executor';
import logger from 'electron-log';

const VERSION_REGEX = /(<Version>)(.*)(<\/Version>)/;
const ASSEMBLY_VERSION_REGEX = /(<AssemblyVersion>)(.*)(<\/AssemblyVersion>)/;
const FILE_VERSION_REGEX = /(<FileVersion>)(.*)(<\/FileVersion>)/;

export function getLocalPackageVersion(slnPath: string, packageName: string): string | undefined {
  const csProjPath = getProjectFilePath(slnPath, packageName);
  const content = fs.readFileSync(csProjPath).toString();

  const parseResult = VERSION_REGEX.exec(content);

  if (parseResult && parseResult.length >= 3) {
    return parseResult[2];
  }

  return undefined;
}

export function getLocalAssemblyVersion(slnPath: string, packageName: string): string | undefined {
  const csProjPath = getProjectFilePath(slnPath, packageName);
  const content = fs.readFileSync(csProjPath).toString();

  const parseResult = ASSEMBLY_VERSION_REGEX.exec(content);

  if (parseResult && parseResult.length >= 3) {
    return parseResult[2];
  }

  return undefined;
}

export function applyNewVersion(version: string, assemblyAndFileVersion: string, slnPath: string, packageName: string): boolean {
  try {
    const csProjPath = getProjectFilePath(slnPath, packageName);
    const content = fs.readFileSync(csProjPath).toString();
    const newContent = content
      .replace(VERSION_REGEX, `$1${version}$3`)
      .replace(ASSEMBLY_VERSION_REGEX, `$1${assemblyAndFileVersion}$3`)
      .replace(FILE_VERSION_REGEX, `$1${assemblyAndFileVersion}$3`);
    fs.writeFileSync(csProjPath, newContent);

    return true;
  }
  catch (e) {
    logger.error(e);
    return false;
  }
}

export async function build(projectFilePath: string): Promise<boolean> {
  return executeCommand('dotnet', ['build', projectFilePath, '-c', 'Release',
    '--output', 'bin/Release', '--verbosity', 'quiet']);
}

export async function checkCommandsAvailability(): Promise<boolean> {
  return executeCommand('dotnet', ['--info']);
}
