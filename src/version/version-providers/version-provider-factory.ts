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
      new PatchVersionProvider(currentVersion, publishedVersions),
      new MinorVersionProvider(currentVersion, publishedVersions),
      new MajorVersionProvider(currentVersion, publishedVersions),
      new CustomVersionProvider(currentVersion, publishedVersions)
    ].filter((p) => p.canGenerateNewVersion());
  }
  
  getProviders(): Map<string, VersionProvider> {
    return this.providers.reduce(
      (map, item) => map.set(item.getName(), item),
      new Map<string, VersionProvider>()
    );
  }
}
