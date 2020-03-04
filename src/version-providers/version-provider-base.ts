import { VersionInfo, IszoleaVersionInfo } from '../version/version';
import { parseVersion } from '../version/nuget-versions-parser';

export default abstract class VersionProviderBase {
  public readonly versionInfo: VersionInfo | undefined;

  constructor(currentVersion: string) {
    this.versionInfo = parseVersion(currentVersion);
  }

  canGenerateNewVersion(): boolean {
    return this.getNewVersion() !== undefined;
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
