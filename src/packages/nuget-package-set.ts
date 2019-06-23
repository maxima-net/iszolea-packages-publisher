import PackageSet from './package-set';
import { getLocalPackageVersion } from '../utils/dotnet-project';
import { PublishingOptions } from '../publishing-strategies';
import DotNetPublishingStrategy from '../publishing-strategies/dotnet-publishing-strategy';
import PublishingStrategy from '../publishing-strategies/publishing-strategy';

export class NugetPackageSet extends PackageSet {
  getLocalPackageVersion(): string | undefined {
    return getLocalPackageVersion(this.baseFolderPath, this.projectsInfo[0].name);
  }

  getStrategy(options: PublishingOptions): PublishingStrategy {
    return new DotNetPublishingStrategy(options);
  }
}
