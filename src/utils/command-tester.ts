import { executeCommand } from './command-executor';

export class CommandTester {
  async checkGitAvailability(): Promise<boolean> {
    const result = await executeCommand({ command: 'git', args: ['--version'], logResponse: false });
    return result.isSuccess;
  }

  async checkDotNetAvailability(): Promise<boolean> {
    const result = await executeCommand({ command: 'dotnet', args: ['--info'], logResponse: false });
    return result.isSuccess;
  }

  async checkNugetAvailability(): Promise<boolean> {
    const result = await executeCommand({ command: 'nuget', args: ['help'], logResponse: false });
    return result.isSuccess;
  }

  async checkNpmAvailability(): Promise<boolean> {
    const result = await executeCommand({ command: 'npm', args: ['version'], logResponse: false });
    return result.isSuccess;
  }
}
