import VersionProviderBase from './version-provider-base';
import { IszoleaVersionInfo } from '../version';

export default class PatchVersionProvider extends VersionProviderBase {
  getName(): string {
    return 'Patch';
  }

  isCustom(): boolean {
    return false;
  }

  getNewVersion(): IszoleaVersionInfo | undefined {
    const targetVersion = this.getTargetVersionInfo();

    if (targetVersion) {
      const vi = targetVersion.version;

      let patch = vi.patch;

      if (vi.betaIndex === undefined) {
        patch = vi.patch + 1;
      } else {
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

  protected getTargetVersion(): IszoleaVersionInfo | undefined {
    const targetPatchVersion = this.findTargetPatchVersion();
    if (targetPatchVersion) {
      return targetPatchVersion;
    }

    return this.versionInfo;
  }

  private findTargetPatchVersion(): IszoleaVersionInfo | undefined {
    const vi = this.versionInfo;
    if (!vi) {
      return undefined;
    }

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
      const latestPatchVersions = this.publishedVersions.filter((v) => {
        return v.isValid && v.parsedVersion && v.parsedVersion.major === vi.major
          && v.parsedVersion.minor === vi.minor && v.parsedVersion.patch > vi.patch;
      }).map((v) => v.parsedVersion);

      const latestPatchVersion = this.getMaxVersion(latestPatchVersions);

      return !latestPatchVersion || latestPatchVersion.patch === undefined
        ? undefined
        : {
          major: vi.major,
          minor: vi.minor,
          patch: latestPatchVersion.patch,
          betaIndex: undefined
        };
    }

    return undefined;
  }
}
