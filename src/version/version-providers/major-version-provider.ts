import { IszoleaVersionInfo } from '../version';
import VersionProviderBase from './version-provider-base';

export default class MajorVersionProvider extends VersionProviderBase {
  getName(): string {
    return 'Major';
  }

  isCustom(): boolean {
    return false;
  }

  getNewVersion(): IszoleaVersionInfo | undefined {
    const targetVersion = this.getTargetVersion();
    
    if (targetVersion) {
      return {
        major: targetVersion.major + 1,
        minor: 0,
        patch: 0,
        betaIndex: undefined
      };
    }

    return undefined;
  }

  protected getTargetVersion(): IszoleaVersionInfo | undefined {
    const targetMinorVersion = this.findTargetMinorVersion();
    if (targetMinorVersion) {
      return targetMinorVersion;
    }

    return this.versionInfo;
  }

  private findTargetMinorVersion(): IszoleaVersionInfo | undefined {
    const vi = this.versionInfo;
    if (!vi) {
      return undefined;
    }

    const isNearestMajorPublished = this.publishedVersions.some((v) => {
      return v.isValid && v.parsedVersion && v.parsedVersion.major === vi.major + 1;
    });

    if (isNearestMajorPublished) {
      const latestMajorVersions = this.publishedVersions.filter((v) => {
        return v.isValid && v.parsedVersion && v.parsedVersion.major >= vi.major;
      }).map((v) => v.parsedVersion);

      const latestMajorVersion = this.getMaxVersion(latestMajorVersions);

      return latestMajorVersion === undefined
        ? undefined
        : { ...latestMajorVersion };
    }

    return undefined;
  }
}
