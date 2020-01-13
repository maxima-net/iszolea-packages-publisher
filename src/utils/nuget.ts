import { executeCommand } from './command-executor';

const SOURCE = 'https://packages.iszolea.net/nuget';

export async function pushPackage(nupkgFilePath: string, apiKey: string): Promise<boolean> {
  return await executeCommand('nuget', ['push', nupkgFilePath, apiKey, '-source', SOURCE]);
}

export function deletePackage(packageName: string, version: string, apiKey: string): Promise<boolean> {
  return executeCommand('nuget', ['delete', packageName, version, apiKey, '-source', SOURCE], undefined, ['y']);
}
