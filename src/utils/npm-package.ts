import fs from 'fs';
import { getUiPackageJsonPath } from './path';
import logger from 'electron-log';
import { executeCommand } from './command-executor';

const VERSION_REGEX = /("version"\s*:\s*")(.*)(",)/;

export function getLocalPackageVersion(iszoleaUiDir: string): string | undefined {
  const packageJsonPath = getUiPackageJsonPath(iszoleaUiDir);
  const content = fs.readFileSync(packageJsonPath).toString();
  const parseResult = JSON.parse(content);

  if (parseResult && parseResult.version) {
    return parseResult.version;
  }

  return undefined;
}

export function applyNewVersion(version: string, iszoleaUiDir: string): boolean {
  try {
    const packageJsonPath = getUiPackageJsonPath(iszoleaUiDir);
    const content = fs.readFileSync(packageJsonPath).toString();
    const newContent = content
      .replace(VERSION_REGEX, `$1${version}$3`);
    fs.writeFileSync(packageJsonPath, newContent);

    return true;
  }
  catch (e) {
    logger.error(e);
    return false;
  }
}

export async function publishPackage(packageJsonDir: string, npmAutoLogin: boolean, npmLogin: string,
  npmPassword: string, npmEmail: string
): Promise<boolean> {
  const loginResult = npmAutoLogin
    ? await executeCommand('npm', ['login'], undefined, [npmLogin, npmPassword, npmEmail])
    : true;

  return loginResult && await executeCommand('npm', ['run', 'publish-please'], undefined, ['y'], packageJsonDir);
}

export async function unPublishPackage(packageName: string, version: string): Promise<boolean> {
  return await executeCommand('npm', ['unpublish', `${packageName}@${version}`]);
}

export async function checkCommandsAvailability(): Promise<boolean> {
  return executeCommand('npm', ['version']);
}
