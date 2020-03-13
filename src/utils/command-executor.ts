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
  logResponse?: boolean;
}

export async function executeCommand(options: ExecuteCommandOptions): Promise<CommandResult> {
  return new Promise<CommandResult>(async (resolve) => {
    const { command, secretArgs, stdinCommands, cwd } = options;

    let response = '';
    
    const logResponse = options.logResponse !== false;
    const args = options.args || [];
    const argsString = args
      .map((a) => getArgument(a, secretArgs))
      .join(' ');

    const fullCommand = `${command} ${argsString}`;
    logger.info(`execute command${!logResponse ? ' without logging response' : ''}: `, fullCommand);

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
      response += data;
      if (logResponse) {
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
