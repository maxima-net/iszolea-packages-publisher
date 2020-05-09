import { VersionProvider } from '.';
import BetaVersionProvider from './beta-version-provider';
import PatchVersionProvider from './patch-version-provider';
import MinorVersionProvider from './minor-version-provider';
import MajorVersionProvider from './major-version-provider';
import CustomVersionProvider from './custom-version-provider';
import { PackageVersionInfo } from '../nuget-versions-parser';

export class VersionProviderFactory {
  private providers: VersionProvider[];

  constructor(currentVersion: string, publishedVersions: PackageVersionInfo[]) {
    this.providers = [
      new BetaVersionProvider(currentVersion, publishedVersions),
      new PatchVersionProvider(currentVersion, publishedVersions),
      new MinorVersionProvider(currentVersion, publishedVersions),
      new MajorVersionProvider(currentVersion, publishedVersions),
      new CustomVersionProvider(currentVersion, publishedVersions)
    ];
  }
  
  getProviders(): VersionProvider[] {
    return this.providers;
  }
}
