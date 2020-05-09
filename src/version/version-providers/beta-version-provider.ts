import { VersionProvider } from '.';
import VersionProviderBase from './version-provider-base';
import { IszoleaVersionInfo, VersionInfo } from '../version';
import { PackageVersionInfo } from '../nuget-versions-parser';
import { parseIszoleaVersion } from '../version-parser';

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
      if (vi.betaIndex) {
        const latestBetaIndexes = this.publishedVersions.filter((v) => {
          return v.isValid && v.parsedVersion && v.parsedVersion.major === vi.major
            && v.parsedVersion.minor === vi.minor && v.parsedVersion.patch === vi.patch
            && v.parsedVersion.betaIndex && vi.betaIndex && v.parsedVersion.betaIndex > vi.betaIndex;
        }).map((v) => v.parsedVersion && v.parsedVersion.betaIndex);

        const latestBetaIndex = latestBetaIndexes.reduce(
          (prev, cur) => prev === undefined || (cur && cur > prev) ? cur : prev,
          undefined
        );

        if (latestBetaIndex) {
          return {
            major: vi.major,
            minor: vi.minor,
            patch: vi.patch,
            suffix: `beta.${latestBetaIndex}`
          };
        }
      } else {
        const betaIndexes = this.publishedVersions.filter((v) => {
          return v.isValid && v.parsedVersion && v.parsedVersion.major === vi.major
            && v.parsedVersion.minor === vi.minor && v.parsedVersion.patch === vi.patch;
        }).map((v) => v.parsedVersion && v.parsedVersion.betaIndex);

        const latestBetaIndex = betaIndexes.reduce(
          (prev, cur) => prev === undefined || (cur && cur > prev) ? cur : prev,
          undefined
        );

        if (latestBetaIndex) {
          return {
            major: vi.major,
            minor: vi.minor,
            patch: vi.patch,
            suffix: `beta.${latestBetaIndex}`
          };
        } else {

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

            if (latestPatchIndex) {
              return {
                major: vi.major,
                minor: vi.minor,
                patch: latestPatchIndex,
                suffix: undefined
              };
            }
          }
        }
      }
    }

    return this.versionInfo;
  }
}
