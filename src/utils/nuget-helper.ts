import util from 'util';
const childProcess = require('child_process');
const exec = util.promisify(childProcess.exec);

export default class NuGetHelper {
  static readonly SOURCE: string = 'https://packages.iszolea.net/nuget';

  static async pushPackage(nupkgFilePath: string, apiKey: string): Promise<boolean> {
    try {
      const command = `nuget push ${nupkgFilePath} ${apiKey} -source ${this.SOURCE}`;
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
