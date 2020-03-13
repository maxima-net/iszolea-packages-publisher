import { executeCommand, CommandResult } from './command-executor';

const SOURCE = 'https://packages.iszolea.net/nuget';

export async function pushPackage(nupkgFilePath: string, apiKey: string): Promise<boolean> {
  const result = await executeCommand({ command: 'nuget', args: ['push', nupkgFilePath, apiKey, '-source', SOURCE] });
  return result.isSuccess;
}

export async function deletePackage(packageName: string, version: string, apiKey: string): Promise<boolean> {
  const result = await executeCommand({ command: 'nuget', args: ['delete', packageName, version, apiKey, '-source', SOURCE], stdinCommands: ['y'] });
  return result.isSuccess;
}

export const getPackageVersions = async (packageName: string): Promise<CommandResult> => {
  return await executeCommand({
    command: 'nuget',
    args: ['list', packageName, '-source', SOURCE, '-AllVersions', '-PreRelease'],
    logResponse: false
  });
};
