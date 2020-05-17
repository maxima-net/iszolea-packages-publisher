import VersionProviderBase from './version-provider-base';
import { IszoleaVersionInfo } from '../version';

export default class MinorVersionProvider extends VersionProviderBase {
  getName(): string {
    return 'Minor';
  }

  isCustom(): boolean {
    return false;
  }

  getNewVersion(): IszoleaVersionInfo | undefined {
    const targetVersion = this.getTargetVersionInfo();;

    if (!targetVersion) {
      return undefined;
    }

    const vi = targetVersion.version;
    return {
      major: vi.major,
      minor: vi.minor + 1,
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

    const nearestMinor: IszoleaVersionInfo = {
      major: vi.major,
      minor: vi.minor + 1,
      patch: 0,
      betaIndex: undefined
    };

    const isNearestMinorPublished = this.publishedVersions.some((v) => {
      return v.isValid && v.parsedVersion && v.parsedVersion.major === nearestMinor.major
        && v.parsedVersion.minor === nearestMinor.minor;
    });

    if (isNearestMinorPublished) {
      const latestMinorVersions = this.publishedVersions.filter((v) => {
        return v.isValid && v.parsedVersion && v.parsedVersion.major === vi.major
          && v.parsedVersion.minor >= vi.minor;
      }).map((v) => v.parsedVersion);

      const latestMinorVersion = this.getMaxVersion(latestMinorVersions);

      return latestMinorVersion === undefined
        ? undefined
        : {
          major: vi.major,
          minor: latestMinorVersion.minor,
          patch: latestMinorVersion.patch,
          betaIndex: latestMinorVersion.betaIndex
        };
    }

    return undefined;
  }
}
