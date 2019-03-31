import CommandExecutor from './command-executor';

export default class NuGetHelper {
  static readonly SOURCE: string = 'https://packages.iszolea.net/nuget';

  static async pushPackage(nupkgFilePath: string, apiKey: string): Promise<boolean> {
    return CommandExecutor.executeCommand('nuget', ['push', nupkgFilePath, apiKey, '-source', this.SOURCE]);
  }

  static async deletePackage(packageName: string, version: string, apiKey: string): Promise<boolean> {
    return CommandExecutor.executeCommand('nuget', ['delete', packageName, version, apiKey, '-source', this.SOURCE], ['y']);
  }
}
