import util from 'util';
import logger from 'electron-log';
const childProcess = require('child_process');
const exec = util.promisify(childProcess.exec);

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
}
