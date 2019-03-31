import CommandExecutor from './command-executor';

export default class DotNetHelper {
  static async buildProject(projectFilePath: string): Promise<boolean> {
    return CommandExecutor.executeCommand('dotnet', ['build', projectFilePath, '-c', 'Release', '--verbosity', 'quiet']);
  }
}

