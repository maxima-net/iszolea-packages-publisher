import { executeCommand } from './command-executor';

export class CommandTester {
  checkGitAvailability(): Promise<boolean> {
    return executeCommand('git', ['--version']);
  }

  checkDotNetAvailability(): Promise<boolean> {
    return executeCommand('dotnet', ['--info']);
  }

  checkNugetAvailability(): Promise<boolean> {
    return executeCommand('nuget', ['help']);
  }

  checkNpmAvailability(): Promise<boolean> {
    return executeCommand('npm', ['version']);
  }
}
