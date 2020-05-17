import { VersionInfo, IszoleaVersionInfo } from '../version';
import { parseVersion } from '../version-parser';
import { TargetVersionInfo, VersionProvider } from '.';
import { PackageVersionInfo } from '../nuget-versions-parser';

export default abstract class VersionProviderBase implements VersionProvider {
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

  getTargetVersionString(): string | undefined {
    const targetVersion = this.getTargetVersion();

    if(!targetVersion) {
      return undefined;
    }

    const v = targetVersion.version;

    const suffix = v.suffix === undefined ? '' : `-${v.suffix}`;
    return `${v.major}.${v.minor}.${v.patch}${suffix} is ${targetVersion.description}`;
  }

  getMaxVersion(latestMajorVersions: Array<IszoleaVersionInfo | undefined>) {
    return latestMajorVersions.reduce(
      (prev, cur) => prev === undefined
        || (cur && (cur.major > prev.major
          || (cur.major === prev.major && cur.minor > prev.minor)
            || (cur.major === prev.major && cur.minor === prev.minor && cur.patch > prev.patch)
              || (cur.major === prev.major && cur.minor === prev.minor && cur.patch === prev.patch && ((cur.betaIndex === undefined && prev.betaIndex !== undefined)
                || (cur.betaIndex !== undefined && prev.betaIndex !== undefined && cur.betaIndex > prev.betaIndex)))))
          ? cur
        : prev,
      undefined
    );
  }

  abstract getNewVersion(): IszoleaVersionInfo | undefined;
  abstract getTargetVersion(): TargetVersionInfo | undefined;
  abstract getName(): string;
  abstract isCustom(): boolean;
}
