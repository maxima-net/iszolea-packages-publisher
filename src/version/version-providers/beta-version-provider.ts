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
    const targetVersion = this.getTargetVersion();

    if (!targetVersion) {
      return undefined;
    }

    const vi = targetVersion.version;

    let patch = vi.patch;
    let betaIndex = 1;

    if (!vi.suffix) {
      patch = vi.patch + 1;
    } else {
      const regex = /beta.(\d+)/;
      const match = vi.suffix.match(regex);

      if (!match || match.length < 2) {
        return undefined;
      }

      const index = +match[1];
      betaIndex = index + 1;
    }

    return {
      major: vi.major,
      minor: vi.minor,
      patch,
      betaIndex
    };
  }

  getTargetVersion(): TargetVersionInfo | undefined {
    const vi = parseIszoleaVersion(this.rawVersion);

    if (vi) {
      const targetBetaVersion = this.findTargetBetaVersion(vi);
      if (targetBetaVersion) {
        return targetBetaVersion;
      }
      else if (!vi.betaIndex) {
        const targetPatchVersion = this.findTargetPatchVersion(vi);
        if (targetPatchVersion) {
          return targetPatchVersion;
        }
      }
    }

    return this.versionInfo ? { version: this.versionInfo, description: TargetVersionDescription.LOCAL_VERSION } : undefined;
  }

  private findTargetBetaVersion(vi: IszoleaVersionInfo): TargetVersionInfo | undefined {
    const latestBetaIndexes = this.publishedVersions.filter((v) => {
      return v.isValid && v.parsedVersion && v.parsedVersion.major === vi.major
        && v.parsedVersion.minor === vi.minor && v.parsedVersion.patch === vi.patch
        && v.parsedVersion.betaIndex && (!vi.betaIndex || v.parsedVersion.betaIndex > vi.betaIndex);
    }).map((v) => v.parsedVersion && v.parsedVersion.betaIndex);

    const latestBetaIndex = latestBetaIndexes.reduce(
      (prev, cur) => prev === undefined || (cur && cur > prev) ? cur : prev,
      undefined
    );

    return latestBetaIndex === undefined
      ? undefined
      : {
        version: {
          major: vi.major,
          minor: vi.minor,
          patch: vi.patch,
          suffix: `beta.${latestBetaIndex}`
        },
        description: TargetVersionDescription.LATEST_PUBLISHED_BETA_VERSION
      };
  }

  private findTargetPatchVersion(vi: IszoleaVersionInfo): TargetVersionInfo | undefined {
    const nextPatch = { ...vi, patch: vi.patch + 1 };
    const isNearestNextPatchOutOfDate = this.publishedVersions.some((v) => {
      return v.isValid && v.parsedVersion && v.parsedVersion.major === nextPatch.major
        && v.parsedVersion.minor === nextPatch.minor && v.parsedVersion.patch >= nextPatch.patch
        && v.parsedVersion.betaIndex === undefined;
    });

    if (isNearestNextPatchOutOfDate) {
      const latestPatchIndexes = this.publishedVersions.filter((v) => {
        return v.isValid && v.parsedVersion && v.parsedVersion.major === vi.major
          && v.parsedVersion.minor === vi.minor && v.parsedVersion.patch > vi.patch;
      }).map((v) => v.parsedVersion && v.parsedVersion.patch);

      const latestPatchIndex = latestPatchIndexes.reduce(
        (prev, cur) => prev === undefined || (cur && cur > prev) ? cur : prev,
        undefined
      );

      return latestPatchIndex === undefined
        ? undefined
        : {
          version: {
            major: vi.major,
            minor: vi.minor,
            patch: latestPatchIndex,
            suffix: undefined
          },
          description: TargetVersionDescription.LATEST_PUBLISHED_PATCH_VERSION
        };
    }
  }
}
