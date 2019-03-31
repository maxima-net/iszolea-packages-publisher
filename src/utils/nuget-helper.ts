import util from 'util';
import logger from 'electron-log';
import ChildProcess from 'child_process';
const exec = util.promisify(ChildProcess.exec);

export default class NuGetHelper {
  static readonly SOURCE: string = 'https://packages.iszolea.net/nuget';

  static async pushPackage(nupkgFilePath: string, apiKey: string): Promise<boolean> {
    try {
      const command = `nuget push "${nupkgFilePath}" "${apiKey}" -source "${this.SOURCE}"`;
      logger.info('command: ', command);
      const { stdout, stderr } = await exec(command);
      logger.info('stdout: ', stdout);
      logger.info('stderr: ', stderr);
      return true
    } catch (e) {
      logger.error('pushPackage: ', e);
      return false;
    }
  }

  static async deletePackage(packageName: string, version: string, apiKey: string): Promise<boolean> {
    return new Promise<boolean>(async (resolve) => {
      const command = `nuget delete "${packageName}" "${version}" "${apiKey}" -source "${this.SOURCE}"`;
      logger.info('command: ', command);
      const spawn = await ChildProcess.spawn('nuget', [
        'delete', packageName, version, apiKey, '-source', this.SOURCE
      ]);

      spawn.stdin && spawn.stdin.write('y\n');
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
