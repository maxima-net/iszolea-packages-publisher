import util from 'util';
import logger from 'electron-log';
const childProcess = require('child_process');
const exec = util.promisify(childProcess.exec);

export default class DotNetHelper {
  static async buildProject(projectFilePath: string): Promise<boolean> {
    try {
      const command = `dotnet build "${projectFilePath}" -c Release --verbosity quiet`;
      logger.info('command: ', command);
      const { stdout, stderr } = await exec(command);
      logger.info('stdout: ', stdout);
      logger.info('stderr: ', stderr);
      return true
    } catch (e) {
      logger.error('buildProject: ', e);
      return false;
    }
  }
}

