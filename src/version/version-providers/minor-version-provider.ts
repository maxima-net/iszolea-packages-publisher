import VersionProviderBase from './version-provider-base';
import { VersionInfo } from '../version';

export default class MinorVersionProvider extends VersionProviderBase {
  getName(): string {
    return 'Minor';
  }

  isCustom(): boolean {
    return false;
  }

  getNewVersion(): VersionInfo | undefined {
    const targetVersion = this.getTargetVersion();

    if (targetVersion) {
      return {
        major: targetVersion.major,
        minor: targetVersion.minor + 1,
        patch: 0,
        betaText: undefined,
        betaIndex: undefined
      };
    }

    return undefined;
  }

  protected getTargetVersion(): VersionInfo | undefined {
    const targetMinorVersion = this.findTargetMinorVersion();
    if (targetMinorVersion) {
      return targetMinorVersion;
    }

    return this.versionInfo;
  }

  private findTargetMinorVersion(): VersionInfo | undefined {
    const vi = this.versionInfo;
    if (!vi) {
      return undefined;
    }

    const isNearestMinorPublished = this.publishedVersions.some((v) => {
      return v.isValid && v.parsedVersion && v.parsedVersion.major === vi.major
        && v.parsedVersion.minor === vi.minor + 1;
    });

    if (isNearestMinorPublished) {
      const latestMinorVersions = this.publishedVersions.filter((v) => {
        return v.isValid && v.parsedVersion && v.parsedVersion.major === vi.major
          && v.parsedVersion.minor >= vi.minor;
      }).map((v) => v.parsedVersion);

      const latestMinorVersion = this.getMaxVersion(latestMinorVersions);

      return latestMinorVersion === undefined
        ? undefined
        : { ...latestMinorVersion };
    }

    return undefined;
  }
}
