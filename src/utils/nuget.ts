import { SecretArg, executeCommand } from './command-executor';

const SOURCE: string = 'https://packages.iszolea.net/nuget';

export async function pushPackage(nupkgFilePath: string, apiKey: string): Promise<boolean> {
  const secretArgs = createSecretArgs(apiKey);
  return await executeCommand('nuget', ['push', nupkgFilePath, apiKey, '-source', SOURCE], secretArgs);
}

export function deletePackage(packageName: string, version: string, apiKey: string): Promise<boolean> {
  const secretArgs = createSecretArgs(apiKey);
  return executeCommand('nuget', ['delete', packageName, version, apiKey, '-source', SOURCE], secretArgs, ['y']);
}

export function checkCommandsAvailability(): Promise<boolean> {
  return executeCommand('nuget', ['help']);
}

function createSecretArgs(apiKey: string): SecretArg[] {
  return [{
    arg: apiKey,
    name: 'NUGET_API_KEY'
  }];
}
