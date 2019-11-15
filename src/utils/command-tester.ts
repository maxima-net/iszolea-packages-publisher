import { executeCommand } from './command-executor';

export class CommandTester {
  checkGitAvailability(): Promise<boolean> {
    return executeCommand('git', ['--version']);
  }
}
