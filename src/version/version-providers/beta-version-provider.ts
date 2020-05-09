import { VersionProvider } from '.';
import VersionProviderBase from './version-provider-base';
import { IszoleaVersionInfo, VersionInfo } from '../version';
import { PackageVersionInfo } from '../nuget-versions-parser';
import { parseIszoleaVersion } from '../version-parser';
import { timingSafeEqual } from 'crypto';

export default class BetaVersionProvider extends VersionProviderBase implements VersionProvider {
  private publishedVersions: PackageVersionInfo[];

  constructor(currentVersion: string, publishedVersions: PackageVersionInfo[]) {
    super(currentVersion);
    this.publishedVersions = publishedVersions;
  }

  getName(): string {
    return 'Beta';
  }

  isCustom(): boolean {
    return false;
  }

  getNewVersion(): IszoleaVersionInfo | undefined {
    const vi = this.getTargetVersion();

    if (!vi) {
      return undefined;
    }

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

  getTargetVersion(): VersionInfo | undefined {
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

    return this.versionInfo;
  }

  private findTargetBetaVersion(vi: IszoleaVersionInfo): VersionInfo | undefined {
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
        major: vi.major,
        minor: vi.minor,
        patch: vi.patch,
        suffix: `beta.${latestBetaIndex}`
      };
  }

  private findTargetPatchVersion(vi: IszoleaVersionInfo): VersionInfo | undefined {
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
          major: vi.major,
          minor: vi.minor,
          patch: latestPatchIndex,
          suffix: undefined
        };
    }
  }
}
