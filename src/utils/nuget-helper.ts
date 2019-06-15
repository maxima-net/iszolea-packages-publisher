import CommandExecutor, { SecretArg } from './command-executor';

export default class NuGetHelper {
  static readonly SOURCE: string = 'https://packages.iszolea.net/nuget';

  static async pushPackage(nupkgFilePath: string, apiKey: string): Promise<boolean> {
    const secretArgs: SecretArg[] = [{
      arg: apiKey,
      name: 'NUGET_API_KEY' 
    }];

    return await CommandExecutor.executeCommand('nuget', ['push', nupkgFilePath, apiKey, '-source', this.SOURCE], secretArgs);
  }

  static async deletePackage(packageName: string, version: string, apiKey: string): Promise<boolean> {
    const secretArgs: SecretArg[] = [{
      arg: apiKey,
      name: 'NUGET_API_KEY' 
    }];

    return CommandExecutor.executeCommand('nuget', ['delete', packageName, version, apiKey, '-source', this.SOURCE], secretArgs, ['y']);
  }

  static async checkCommandsAvailability(): Promise<boolean> {
    return CommandExecutor.executeCommand('nuget', ['help']);
  }
}
