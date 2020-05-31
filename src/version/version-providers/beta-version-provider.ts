import VersionProviderBase from './version-provider-base';
import { VersionInfo } from '../version';
import { PackageVersionInfo } from '../nuget-versions-parser';

export default class BetaVersionProvider extends VersionProviderBase {
  protected readonly betaText: string | undefined;

  constructor(currentVersion: string, publishedVersions: PackageVersionInfo[], betaText: string | undefined) {
    super(currentVersion, publishedVersions);
    this.betaText = betaText;
  }

  getName(): string {
    return 'Beta';
  }

  isCustom(): boolean {
    return false;
  }

  canGenerateNewVersion(): boolean {
    return this.betaText !== undefined && this.getNewVersion() !== undefined;
  }

  getNewVersion(): VersionInfo | undefined {
    const targetVersion = this.getTargetVersion();

    if (targetVersion) {
      const vi = targetVersion;
      let betaIndex = 1;

      if (this.versionInfo && this.versionInfo.patch === vi.patch && vi.betaIndex) {
        betaIndex = vi.betaIndex + 1;
      }

      return {
        major: vi.major,
        minor: vi.minor,
        patch: vi.patch,
        betaText: this.betaText,
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

    return this.versionInfo;
  }

  private findTargetBetaVersion(): VersionInfo | undefined {
    const vi = this.versionInfo;
    if (!vi) {
      return undefined;
    }

    const latestBetaVersions = this.publishedVersions.filter((v) => {
      return v.isValid && v.parsedVersion && v.parsedVersion.major === vi.major
        && v.parsedVersion.minor === vi.minor && v.parsedVersion.patch === vi.patch
        && v.parsedVersion.betaIndex && v.parsedVersion.betaText === this.betaText && (!vi.betaIndex || (v.parsedVersion.betaIndex > vi.betaIndex));
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
}
