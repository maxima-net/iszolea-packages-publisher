import { executeCommand } from './command-executor';

export class CommandTester {
  async checkGitAvailability(): Promise<boolean> {
    const result = await executeCommand({ command: 'git', args: ['--version'] });
    return result.isSuccess;
  }

  async checkDotNetAvailability(): Promise<boolean> {
    const result = await executeCommand({ command: 'dotnet', args: ['--info'] });
    return result.isSuccess;
  }

  async checkNugetAvailability(): Promise<boolean> {
    const result = await executeCommand({ command: 'nuget', args: ['help'] });
    return result.isSuccess;
  }

  async checkNpmAvailability(): Promise<boolean> {
    const result = await executeCommand({ command: 'npm', args: ['version'] });
    return result.isSuccess;
  }
}
