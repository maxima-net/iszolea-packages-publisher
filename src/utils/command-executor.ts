import logger from 'electron-log';
import ChildProcess from 'child_process';

export default class CommandExecutor {
  static async executeCommand(command: string, args: string[], stdinCommands?: string[]): Promise<boolean> {
    return new Promise<boolean>(async (resolve) => {
      const fullCommand = `${command} ${args.map(a => a.indexOf(' ') === -1 ? a : `"${a}"`).join(' ')}`;
      logger.info('execute command: ', fullCommand);

      const spawn = await ChildProcess.spawn(command, args);

      if (spawn.stdin && stdinCommands) {
        for (const stdinCommand of stdinCommands) {
          spawn.stdin.write(`${stdinCommand}\n`);
        }
      }

      spawn.on('error', (e) => {
        logger.error('command executed with error: ', e);
        resolve(false);
      });
      spawn.on('close', (code) => {
        logger.info(`command executed with code: ${code}`);
        resolve(code === 0);
      });
      spawn.stdout && spawn.stdout.on('data', (data) => {
        logger.info(`stdout:\n${data}`);
      });
      spawn.stderr && spawn.stderr.on('data', (data) => {
        logger.error(`child stderr:\n${data}`);
      });
    });
  }
}
