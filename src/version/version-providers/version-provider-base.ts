import { IszoleaVersionInfo } from '../version';
import { parseIszoleaVersion } from '../version-parser';
import { CompareVersionsResult, VersionProvider } from '.';
import { PackageVersionInfo } from '../nuget-versions-parser';

export interface TargetVersionInfo {
  version: IszoleaVersionInfo;
  description: TargetVersionDescription;
}

export enum TargetVersionDescription {
  LOCAL_VERSION = 'the latest local version',
  LATEST_PUBLISHED_BETA_VERSION = 'the latest published beta version',
  LATEST_PUBLISHED_PATCH_VERSION = 'the latest published patch version',
  LATEST_PUBLISHED_MINOR_VERSION = 'the latest published minor version',
  LATEST_PUBLISHED_MAJOR_VERSION = 'the latest published major version',
}

export default abstract class VersionProviderBase implements VersionProvider {
  public readonly versionInfo: IszoleaVersionInfo | undefined;
  protected readonly rawVersion: string;
  protected readonly publishedVersions: PackageVersionInfo[];

  constructor(currentVersion: string, publishedVersions: PackageVersionInfo[]) {
    this.rawVersion = currentVersion;
    this.publishedVersions = publishedVersions;

    this.versionInfo = parseIszoleaVersion(currentVersion);
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
    const targetVersion = this.getTargetVersionInfo();

    if(!targetVersion) {
      return undefined;
    }

    const v = targetVersion.version;

    const suffix = v.betaIndex === undefined ? '' : `-beta.${v.betaIndex}`;
    return `${v.major}.${v.minor}.${v.patch}${suffix} is ${targetVersion.description}`;
  }
  
  getTargetVersionInfo(): TargetVersionInfo | undefined {
    const tv = this.getTargetVersion();
    const cv = this.versionInfo;

    if (tv && cv) {
      const c = this.compareVersions(tv, cv);
      let description: TargetVersionDescription;
      if(c.equal) {
        description = TargetVersionDescription.LOCAL_VERSION;
      } else if ((c.majorEqual && c.minorEqual && c.patchEqual && !c.betaEqual) || tv.betaIndex !== undefined) {
        description = TargetVersionDescription.LATEST_PUBLISHED_BETA_VERSION;
      } else if (c.majorEqual && c.minorEqual) {
        description = TargetVersionDescription.LATEST_PUBLISHED_PATCH_VERSION;
      } else if (c.majorEqual) {
        description = TargetVersionDescription.LATEST_PUBLISHED_MINOR_VERSION;
      } else {
        description = TargetVersionDescription.LATEST_PUBLISHED_MAJOR_VERSION;
      }

      return {
        version: tv,
        description
      };
    }

    return undefined; 
  }

  protected compareVersions(a: IszoleaVersionInfo, b: IszoleaVersionInfo): CompareVersionsResult {
    const majorEqual = a.major === b.major;
    const minorEqual = a.minor === b.minor;;
    const patchEqual = a.patch === b.patch;
    const betaEqual = a.betaIndex === b.betaIndex;
    const equal = majorEqual && minorEqual && patchEqual && betaEqual; 

    return {
      equal, majorEqual, minorEqual, patchEqual, betaEqual
    };
  }

  protected getMaxVersion(latestMajorVersions: Array<IszoleaVersionInfo | undefined>) {
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
  abstract getName(): string;
  abstract isCustom(): boolean;
  protected abstract getTargetVersion(): IszoleaVersionInfo | undefined;
}
