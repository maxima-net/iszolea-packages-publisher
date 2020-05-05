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
      new PatchVersionProvider(currentVersion),
      new MinorVersionProvider(currentVersion),
      new MajorVersionProvider(currentVersion),
      new CustomVersionProvider(currentVersion)
    ];
  }
  
  getProviders(): VersionProvider[] {
    return this.providers;
  }
}
