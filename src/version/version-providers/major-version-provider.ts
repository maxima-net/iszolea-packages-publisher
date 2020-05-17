import { VersionProvider, TargetVersionInfo, TargetVersionDescription } from '.';
import { IszoleaVersionInfo } from '../version';
import VersionProviderBase from './version-provider-base';
import { parseIszoleaVersion } from '../version-parser';

export default class MajorVersionProvider extends VersionProviderBase implements VersionProvider {
  getName(): string {
    return 'Major';
  }

  isCustom(): boolean {
    return false;
  }

  getNewVersion(): IszoleaVersionInfo | undefined {
    const targetVersion = this.getTargetVersion();
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

  getTargetVersion(): TargetVersionInfo | undefined {
    const vi = parseIszoleaVersion(this.rawVersion);

    if (vi) {
      const targetMinorVersion = this.findTargetMinorVersion(vi);
      if (targetMinorVersion) {
        return targetMinorVersion;
      }
    }
    
    return this.versionInfo ? { version: this.versionInfo, description: TargetVersionDescription.LOCAL_VERSION } : undefined;
  }

  private findTargetMinorVersion(vi: IszoleaVersionInfo): TargetVersionInfo | undefined {
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
          version: {
            major: latestMajorVersion.major,
            minor: latestMajorVersion.minor,
            patch: latestMajorVersion.patch,
            suffix: latestMajorVersion.betaIndex !== undefined ? `beta.${latestMajorVersion.betaIndex}` : undefined
          },
          description: TargetVersionDescription.LATEST_PUBLISHED_MAJOR_VERSION
        };
    }

    return undefined;
  }
}
