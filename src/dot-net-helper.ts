
import util from 'util';
const childProcess = require('child_process');

const exec = util.promisify(childProcess.exec);

export default class DotNetHelper {
  static async buildProject(projectFilePath: string): Promise<boolean> {
    try {
      const command = `dotnet build ${projectFilePath} -c Release`;
      console.log('command: ', command);
      const { stdout, stderr } = await exec(command);
      console.log('stdout: ', stdout);
      console.log('stderr: ', stderr);
      return true
    }
    catch(e) {
      console.log('command exception: ', e);
      return false;
    }
  }
}

