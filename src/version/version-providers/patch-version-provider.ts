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
    const targetVersion = this.getTargetVersion();

    if (targetVersion && this.versionInfo) {
      const vi = targetVersion;

      let patch = vi.patch;

      const compareResult = this.compareVersions(this.versionInfo, targetVersion);

      if (!compareResult.patchEqual || vi.betaIndex === undefined) {
        patch = vi.patch + 1;
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
    const targetPatchVersion = this.findTargetPatchOrBetaVersion();
    if (targetPatchVersion) {
      return targetPatchVersion;
    }

    return this.versionInfo;
  }

  private findTargetPatchOrBetaVersion(): IszoleaVersionInfo | undefined {
    const vi = this.versionInfo;
    if (!vi) {
      return undefined;
    }

    const isCurrentPatchPublished = this.publishedVersions.some((v) => {
      return v.isValid && v.parsedVersion && v.parsedVersion.major === vi.major
        && v.parsedVersion.minor === vi.minor && v.parsedVersion.patch === vi.patch
        && v.parsedVersion.betaIndex === undefined;
    });

    if (isCurrentPatchPublished || vi.betaIndex === undefined) {
      const latestPatchVersions = this.publishedVersions.filter((v) => {
        return v.isValid && v.parsedVersion && v.parsedVersion.major === vi.major
          && v.parsedVersion.minor === vi.minor && v.parsedVersion.patch > vi.patch;
      }).map((v) => v.parsedVersion);

      const latestPatchVersion = this.getMaxVersion(latestPatchVersions);

      return !latestPatchVersion || latestPatchVersion.patch === undefined
        ? undefined
        : { ...latestPatchVersion };
    }

    return undefined;
  }
}
