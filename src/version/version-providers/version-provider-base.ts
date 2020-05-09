import { VersionInfo, IszoleaVersionInfo } from '../version';
import { parseVersion } from '../version-parser';
import { TargetVersionInfo } from '.';
import { PackageVersionInfo } from '../nuget-versions-parser';

export default abstract class VersionProviderBase {
  public readonly versionInfo: VersionInfo | undefined;
  protected readonly rawVersion: string;
  protected readonly publishedVersions: PackageVersionInfo[];

  constructor(currentVersion: string, publishedVersions: PackageVersionInfo[]) {
    this.rawVersion = currentVersion;
    this.publishedVersions = publishedVersions;

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
  abstract getTargetVersion(): TargetVersionInfo | undefined;
}
