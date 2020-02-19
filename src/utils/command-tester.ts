import { executeCommand } from './command-executor';

export class CommandTester {
  async checkGitAvailability(): Promise<boolean> {
    const result = await executeCommand('git', ['--version']);
    return result.isSuccess;
  }

  async checkDotNetAvailability(): Promise<boolean> {
    const result = await executeCommand('dotnet', ['--info']);
    return result.isSuccess;
  }

  async checkNugetAvailability(): Promise<boolean> {
    const result = await executeCommand('nuget', ['help']);
    return result.isSuccess;
  }

  async checkNpmAvailability(): Promise<boolean> {
    const result = await executeCommand('npm', ['version']);
    return result.isSuccess;
  }
}
