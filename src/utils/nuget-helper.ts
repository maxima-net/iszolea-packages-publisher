import CommandExecutor, { SecretArg } from './command-executor';

const SOURCE: string = 'https://packages.iszolea.net/nuget';

export async function pushPackage(nupkgFilePath: string, apiKey: string): Promise<boolean> {
  const secretArgs: SecretArg[] = [{
    arg: apiKey,
    name: 'NUGET_API_KEY'
  }];

  return await CommandExecutor.executeCommand('nuget', ['push', nupkgFilePath, apiKey, '-source', SOURCE], secretArgs);
}

export function deletePackage(packageName: string, version: string, apiKey: string): Promise<boolean> {
  const secretArgs: SecretArg[] = [{
    arg: apiKey,
    name: 'NUGET_API_KEY'
  }];

  return CommandExecutor.executeCommand('nuget', ['delete', packageName, version, apiKey, '-source', SOURCE], secretArgs, ['y']);
}

export function checkCommandsAvailability(): Promise<boolean> {
  return CommandExecutor.executeCommand('nuget', ['help']);
}
