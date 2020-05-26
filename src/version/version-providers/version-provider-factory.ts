import { VersionProvider } from '.';
import BetaVersionProvider from './beta-version-provider';
import PatchVersionProvider from './patch-version-provider';
import MinorVersionProvider from './minor-version-provider';
import MajorVersionProvider from './major-version-provider';
import CustomVersionProvider from './custom-version-provider';
import { PackageVersionInfo } from '../nuget-versions-parser';

export class VersionProviderFactory {
  private providers: VersionProvider[];

  constructor(currentVersion: string, publishedVersions: PackageVersionInfo[], betaText: string | undefined) {
    this.providers = [
      new BetaVersionProvider(currentVersion, publishedVersions, betaText),
      new PatchVersionProvider(currentVersion, publishedVersions, betaText),
      new MinorVersionProvider(currentVersion, publishedVersions, betaText),
      new MajorVersionProvider(currentVersion, publishedVersions, betaText),
      new CustomVersionProvider(currentVersion, publishedVersions, betaText)
    ].filter((p) => p.canGenerateNewVersion());
  }
  
  getProviders(): Map<string, VersionProvider> {
    return this.providers.reduce(
      (map, item) => map.set(item.getName(), item),
      new Map<string, VersionProvider>()
    );
  }
}
