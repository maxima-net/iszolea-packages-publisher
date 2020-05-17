import { VersionProvider, TargetVersionInfo, TargetVersionDescription } from '.';
import VersionProviderBase from './version-provider-base';
import { IszoleaVersionInfo } from '../version';
import { parseIszoleaVersion } from '../version-parser';


export default class MinorVersionProvider extends VersionProviderBase implements VersionProvider {
  getName(): string {
    return 'Minor';
  }

  isCustom(): boolean {
    return false;
  }

  getNewVersion(): IszoleaVersionInfo | undefined {
    const targetVersion = this.getTargetVersion();;

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
          version: {
            major: vi.major,
            minor: latestMinorVersion.minor,
            patch: latestMinorVersion.patch,
            suffix: latestMinorVersion.betaIndex !== undefined ? `beta.${latestMinorVersion.betaIndex}` : undefined
          },
          description: TargetVersionDescription.LATEST_PUBLISHED_MINOR_VERSION
        };
    }

    return undefined;
  }
}
