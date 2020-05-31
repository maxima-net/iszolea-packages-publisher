import VersionProviderBase from './version-provider-base';
import { VersionInfo } from '../version';

export default class PatchVersionProvider extends VersionProviderBase {
  getName(): string {
    return 'Patch';
  }

  isCustom(): boolean {
    return false;
  }

  getNewVersion(): VersionInfo | undefined {
    const targetVersion = this.getTargetVersion();

    if (targetVersion) {
      return {
        major: targetVersion.major,
        minor: targetVersion.minor,
        patch:  targetVersion.patch + 1,
        betaText: undefined,
        betaIndex: undefined
      };
    }

    return undefined;
  }

  protected getTargetVersion(): VersionInfo | undefined {
    const targetPatchVersion = this.findTargetPatchOrBetaVersion();
    if (targetPatchVersion) {
      return targetPatchVersion;
    }

    return this.versionInfo;
  }

  private findTargetPatchOrBetaVersion(): VersionInfo | undefined {
    const vi = this.versionInfo;
    if (!vi) {
      return undefined;
    }


    const latestPatchVersions = this.publishedVersions.filter((v) => {
      return v.isValid && v.parsedVersion && v.parsedVersion.major === vi.major
        && v.parsedVersion.minor === vi.minor && v.parsedVersion.patch > vi.patch;
    }).map((v) => v.parsedVersion);

    const latestPatchVersion = this.getMaxVersion(latestPatchVersions);

    return !latestPatchVersion || latestPatchVersion.patch === undefined
      ? undefined
      : { ...latestPatchVersion };
  }
}
