import logger from 'electron-log';
import ChildProcess from 'child_process';

export interface SecretArg {
  arg: string;
  name: string;
}

export async function executeCommand(command: string, args?: string[], secretArgs?: SecretArg[], stdinCommands?: string[], cwd?: string): Promise<boolean> {
  return new Promise<boolean>(async (resolve) => {
    args = args || [];
    const argsString = args
      .map(a => getArgument(a, secretArgs))
      .join(' ');

    const fullCommand = `${command} ${argsString}`;
    logger.info('execute command: ', fullCommand);

    const correctedArgs = args.map(a => getArgument(a));
    const spawn = await ChildProcess.spawn(command, correctedArgs, { shell: true, cwd });

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
      if (spawn.stdin && stdinCommands) {
        const stdinCommand = stdinCommands.shift();
        if (stdinCommand) {
          spawn.stdin.write(`${stdinCommand}\n`);
        }
      }
    });
    spawn.stderr && spawn.stderr.on('data', (data: string) => {
      logger.error(`child stderr:\n${data}`);
      if (data.indexOf('ERR!') !== -1) {
        resolve(false);
      }
    });
  });
}

function getArgument(rawArgument: string, secretArgs?: SecretArg[]) {
  const secretArg = secretArgs && secretArgs.find(s => s.arg === rawArgument);

  if (secretArg) {
    return `<${secretArg.name}>`;
  }

  return rawArgument.indexOf(' ') === -1 ? rawArgument : `"${rawArgument}"`;
}
