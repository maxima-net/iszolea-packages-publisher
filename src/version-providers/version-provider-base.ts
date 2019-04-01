import { VersionInfo, IszoleaVersionInfo } from '.';

export default abstract class VersionProviderBase {
  public readonly versionInfo: VersionInfo | undefined;

  constructor(currentVersion: string) {
    this.versionInfo = this.parseVersion(currentVersion);
  }

  canGenerateNewVersion() : boolean {
    return this.getNewVersion() !== undefined;
  }

  private parseVersion(version: string) : VersionInfo | undefined {
    let result: VersionInfo | undefined = undefined; 
    const regex = /(\d+)\.(\d+)\.(\d+)(?:-)?(.*)?/;
    const matchResult = version.match(regex);
    
    if(matchResult && matchResult.length >= 3) {
      result = {
        major: +matchResult[1],
        minor: +matchResult[2],
        patch: +matchResult[3],
        suffix: matchResult[4]
      }  
    }
    
    return result
  }

    
  getNewVersionString(): string {
    const v = this.getNewVersion();
    
    if(!v) {
      return '';
    }

    const suffix = v.betaIndex !== undefined ? `-beta.${v.betaIndex}` : '';
    return `${v.major}.${v.minor}.${v.patch}${suffix}`;
  }

  abstract getNewVersion(): IszoleaVersionInfo | undefined;
}
