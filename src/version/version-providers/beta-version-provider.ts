import VersionProviderBase from './version-provider-base';
import { VersionInfo } from '../version';

export default class BetaVersionProvider extends VersionProviderBase {
  getName(): string {
    return 'Beta';
  }

  isCustom(): boolean {
    return false;
  }

  getNewVersion(): VersionInfo | undefined {
    const targetVersion = this.getTargetVersion();

    if (targetVersion) {
      const vi = targetVersion;
      let patch = vi.patch;
      let betaIndex = 1;

      if (this.versionInfo && this.versionInfo.patch === vi.patch && vi.betaIndex) {
        betaIndex = vi.betaIndex + 1;
      } else {
        patch = vi.patch + 1;
      }

      return {
        major: vi.major,
        minor: vi.minor,
        patch,
        betaText: vi.betaText,
        betaIndex
      };
    }

    return undefined;
  }

  protected getTargetVersion(): VersionInfo | undefined {
    const targetBetaVersion = this.findTargetBetaVersion();
    if (targetBetaVersion) {
      return targetBetaVersion;
    }
    else {
      const targetPatchVersion = this.findTargetPatchVersion();
      if (targetPatchVersion) {
        return targetPatchVersion;
      }
    }

    return this.versionInfo;
  }

  private findTargetBetaVersion(): VersionInfo | undefined {
    const vi = this.versionInfo;
    if (!vi) {
      return undefined;
    }

    const isCurrentBetaReleased = this.publishedVersions.some((v) => {
      return v.isValid && v.parsedVersion && v.parsedVersion.major === vi.major
        && v.parsedVersion.minor === vi.minor && v.parsedVersion.patch === vi.patch
        && v.parsedVersion.betaIndex === undefined;
    });

    if (!isCurrentBetaReleased) {
      const latestBetaVersions = this.publishedVersions.filter((v) => {
        return v.isValid && v.parsedVersion && v.parsedVersion.major === vi.major
          && v.parsedVersion.minor === vi.minor && v.parsedVersion.patch === vi.patch
          && v.parsedVersion.betaIndex && (!vi.betaIndex || v.parsedVersion.betaIndex > vi.betaIndex);
      }).map((v) => v.parsedVersion);

      const latestBetaVersion = this.getMaxVersion(latestBetaVersions);

      const [latestBetaIndex, betaText] = latestBetaVersion && latestBetaVersion.betaIndex !== undefined
        ? [latestBetaVersion.betaIndex, latestBetaVersion.betaText]
        : vi.betaIndex !== undefined
          ? [vi.betaIndex, vi.betaText]
          : [undefined, undefined];

      return latestBetaIndex === undefined
        ? undefined
        : {
          major: vi.major,
          minor: vi.minor,
          patch: vi.patch,
          betaText,
          betaIndex: latestBetaIndex
        };
    }

    return undefined;
  }

  private findTargetPatchVersion(): VersionInfo | undefined {
    const vi = this.versionInfo;
    if (!vi) {
      return undefined;
    }

    const isNearestNextPatchOutOfDate = this.publishedVersions.some((v) => {
      return v.isValid && v.parsedVersion && v.parsedVersion.major === vi.major
        && v.parsedVersion.minor === vi.minor && v.parsedVersion.patch > vi.patch;
    });

    if (isNearestNextPatchOutOfDate) {
      const latestPatchVersions = this.publishedVersions.filter((v) => {
        return v.isValid && v.parsedVersion && v.parsedVersion.major === vi.major
          && v.parsedVersion.minor === vi.minor && v.parsedVersion.patch > vi.patch;
      }).map((v) => v.parsedVersion);

      const latestPatch = this.getMaxVersion(latestPatchVersions);

      return latestPatch === undefined
        ? undefined
        : { ...latestPatch };
    }
  }
}
