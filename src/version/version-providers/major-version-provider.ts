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
    const targetVersion = this.getTargetVersionInfo();
    if (!targetVersion) {
      return undefined;
    }

    const vi = targetVersion.version;

    return {
      major: vi.major + 1,
      minor: 0,
      patch: 0,
      betaIndex: undefined
    };
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

    const nearestMajor: IszoleaVersionInfo = {
      major: vi.major + 1,
      minor: 0,
      patch: 0,
      betaIndex: undefined
    };

    const isNearestMajorPublished = this.publishedVersions.some((v) => {
      return v.isValid && v.parsedVersion && v.parsedVersion.major === nearestMajor.major;
    });

    if (isNearestMajorPublished) {
      const latestMajorVersions = this.publishedVersions.filter((v) => {
        return v.isValid && v.parsedVersion && v.parsedVersion.major >= vi.major;
      }).map((v) => v.parsedVersion);

      const latestMajorVersion = this.getMaxVersion(latestMajorVersions);

      return latestMajorVersion === undefined
        ? undefined
        : {
          major: latestMajorVersion.major,
          minor: latestMajorVersion.minor,
          patch: latestMajorVersion.patch,
          betaIndex: latestMajorVersion.betaIndex
        };
    }

    return undefined;
  }
}
