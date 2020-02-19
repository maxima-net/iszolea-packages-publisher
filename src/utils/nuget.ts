import { executeCommand, CommandResult } from './command-executor';

const SOURCE = 'https://packages.iszolea.net/nuget';

export async function pushPackage(nupkgFilePath: string, apiKey: string): Promise<boolean> {
  const result = await executeCommand('nuget', ['push', nupkgFilePath, apiKey, '-source', SOURCE]);
  return result.isSuccess;
}

export async function deletePackage(packageName: string, version: string, apiKey: string): Promise<boolean> {
  const result = await executeCommand('nuget', ['delete', packageName, version, apiKey, '-source', SOURCE], undefined, ['y']);
  return result.isSuccess;
}

export const getPackageVersions = async (packageName: string): Promise<CommandResult> => {
  return await executeCommand(
    'nuget',
    ['list', packageName, '-source', SOURCE, '-AllVersions', '-PreRelease'],
    undefined,
    undefined,
    undefined,
    true
  );
};
