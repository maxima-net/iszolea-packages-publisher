import { VersionProvider, TargetVersionInfo, TargetVersionDescription } from '.';
import VersionProviderBase from './version-provider-base';
import { IszoleaVersionInfo } from '../version';
import { parseIszoleaVersion } from '../version-parser';

export default class BetaVersionProvider extends VersionProviderBase implements VersionProvider {
  getName(): string {
    return 'Beta';
  }

  isCustom(): boolean {
    return false;
  }

  getNewVersion(): IszoleaVersionInfo | undefined {
    const currentVersion = parseIszoleaVersion(this.rawVersion);
    const targetVersion = this.getTargetVersion();

    if (targetVersion) {
      const vi = targetVersion.version;
      let patch = vi.patch;
      let betaIndex = 1;

      if (currentVersion && currentVersion.patch === vi.patch && vi.suffix) {
        const regex = /beta.(\d+)/;
        const match = vi.suffix.match(regex);

        if (!match || match.length < 2) {
          return undefined;
        }

        const index = +match[1];
        betaIndex = index + 1;
      } else {
        patch = vi.patch + 1;
      }

      return {
        major: vi.major,
        minor: vi.minor,
        patch,
        betaIndex
      };
    }

    return undefined;
  }

  getTargetVersion(): TargetVersionInfo | undefined {
    const vi = parseIszoleaVersion(this.rawVersion);

    if (vi) {
      const targetBetaVersion = this.findTargetBetaVersion(vi);
      if (targetBetaVersion) {
        return targetBetaVersion;
      }
      else {
        const targetPatchVersion = this.findTargetPatchVersion(vi);
        if (targetPatchVersion) {
          return targetPatchVersion;
        }
      }
    }

    return this.versionInfo ? { version: this.versionInfo, description: TargetVersionDescription.LOCAL_VERSION } : undefined;
  }

  private findTargetBetaVersion(vi: IszoleaVersionInfo): TargetVersionInfo | undefined {
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

      const latestBetaIndex = latestBetaVersion && latestBetaVersion.betaIndex !== undefined
        ? latestBetaVersion.betaIndex
        : vi.betaIndex !== undefined
          ? vi.betaIndex
          : undefined;

      return latestBetaIndex === undefined
        ? undefined
        : {
          version: {
            major: vi.major,
            minor: vi.minor,
            patch: vi.patch,
            suffix: `beta.${latestBetaIndex}`
          },
          description: vi.betaIndex === latestBetaIndex ? TargetVersionDescription.LOCAL_VERSION : TargetVersionDescription.LATEST_PUBLISHED_BETA_VERSION
        };
    }

    return undefined;
  }

  private findTargetPatchVersion(vi: IszoleaVersionInfo): TargetVersionInfo | undefined {
    const nextPatch = { ...vi, patch: vi.patch + 1 };
    const isNearestNextPatchOutOfDate = this.publishedVersions.some((v) => {
      return v.isValid && v.parsedVersion && v.parsedVersion.major === nextPatch.major
        && v.parsedVersion.minor === nextPatch.minor && v.parsedVersion.patch >= nextPatch.patch;
    });

    if (isNearestNextPatchOutOfDate) {
      const latestPatchVersions = this.publishedVersions.filter((v) => {
        return v.isValid && v.parsedVersion && v.parsedVersion.major === vi.major
          && v.parsedVersion.minor === vi.minor && v.parsedVersion.patch > vi.patch;
      }).map((v) => v.parsedVersion);

      const latestPatch = this.getMaxVersion(latestPatchVersions);

      return latestPatch === undefined
        ? undefined
        : {
          version: {
            major: vi.major,
            minor: vi.minor,
            patch: latestPatch.patch,
            suffix: latestPatch.betaIndex !== undefined ? `beta.${latestPatch.betaIndex}` : undefined
          },
          description: TargetVersionDescription.LATEST_PUBLISHED_PATCH_VERSION
        };
    }
  }
}
