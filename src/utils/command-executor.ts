import logger from 'electron-log';
import ChildProcess from 'child_process';

export interface SecretArg {
  arg: string;
  name: string;
}

export interface CommandResult {
  data?: string;
  isSuccess: boolean;
}

export interface ExecuteCommandOptions {
  command: string;
  args?: string[];
  secretArgs?: SecretArg[];
  stdinCommands?: string[];
  cwd?: string;
  includeResponse?: boolean;
}

export async function executeCommand({ command, args, secretArgs, stdinCommands, cwd, includeResponse }: ExecuteCommandOptions): Promise<CommandResult> {
  return new Promise<CommandResult>(async (resolve) => {
    let response = '';

    args = args || [];
    const argsString = args
      .map((a) => getArgument(a, secretArgs))
      .join(' ');

    const fullCommand = `${command} ${argsString}`;
    logger.info(`execute command${includeResponse ? ' without logging response' : ''}: `, fullCommand);

    const correctedArgs = args.map((a) => getArgument(a));
    const spawn = await ChildProcess.spawn(command, correctedArgs, { shell: true, cwd });

    spawn.on('error', (e) => {
      logger.error('command executed with error: ', e);
      resolve({
        isSuccess: false
      });
    });
    spawn.on('close', (code) => {
      logger.info(`command executed with code: ${code}`);
      resolve({
        isSuccess: code === 0,
        data: response
      });
    });
    spawn.stdout && spawn.stdout.on('data', (data: string) => {
      if (includeResponse) {
        response += data;
      } else {
        logger.info(`stdout:\n${data}`);
      }

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
        resolve({
          isSuccess: false
        });
      }
    });
  });
}

function getArgument(rawArgument: string, secretArgs?: SecretArg[]) {
  const secretArg = secretArgs && secretArgs.find((s) => s.arg === rawArgument);

  if (secretArg) {
    return `<${secretArg.name}>`;
  }

  return rawArgument.indexOf(' ') === -1 ? rawArgument : `"${rawArgument}"`;
}
