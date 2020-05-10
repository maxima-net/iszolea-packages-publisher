import { VersionProvider, TargetVersionInfo, TargetVersionDescription } from '.';
import VersionProviderBase from './version-provider-base';
import { IszoleaVersionInfo } from '../version';
import { parseIszoleaVersion } from '../version-parser';

export default class PatchVersionProvider extends VersionProviderBase implements VersionProvider {
  getName(): string {
    return 'Patch';
  }

  isCustom(): boolean {
    return false;
  }

  getNewVersion(): IszoleaVersionInfo | undefined {
    const targetVersion = this.getTargetVersion();

    if (targetVersion) {
      const vi = targetVersion.version;

      let patch = vi.patch;

      if (!vi.suffix) {
        patch = vi.patch + 1;
      } else {
        const regex = /beta.(\d+)/;
        const match = vi.suffix.match(regex);

        if (!match || match.length < 2) {
          return undefined;
        }

        patch = vi.patch;
      }

      return {
        major: vi.major,
        minor: vi.minor,
        patch,
        betaIndex: undefined
      };
    }

    return undefined;
  }

  getTargetVersion(): TargetVersionInfo | undefined {
    const vi = parseIszoleaVersion(this.rawVersion);

    if (vi) {
      const targetPatchVersion = this.findTargetPatchVersion(vi);
      if (targetPatchVersion) {
        return targetPatchVersion;
      }
    }
    
    return this.versionInfo ? { version: this.versionInfo, description: TargetVersionDescription.LOCAL_VERSION } : undefined;
  }

  private findTargetPatchVersion(vi: IszoleaVersionInfo): TargetVersionInfo | undefined {
    const currentPatch: IszoleaVersionInfo = {
      major: vi.major,
      minor: vi.minor,
      patch: vi.patch,
      betaIndex: undefined
    };

    const isCurrentPatchPublished = this.publishedVersions.some((v) => {
      return v.isValid && v.parsedVersion && v.parsedVersion.major === currentPatch.major
        && v.parsedVersion.minor === currentPatch.minor && v.parsedVersion.patch === currentPatch.patch
        && v.parsedVersion.betaIndex === currentPatch.betaIndex;
    });

    if (isCurrentPatchPublished || vi.betaIndex === undefined) {
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

    return undefined;
  }
}
