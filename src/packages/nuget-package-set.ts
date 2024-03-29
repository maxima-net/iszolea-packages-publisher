import PackageSet from './package-set';
import { PublishingOptions } from '../publishing-strategies/publishing-options';
import DotNetPublishingStrategy from '../publishing-strategies/dotnet-publishing-strategy';
import PublishingStrategy from '../publishing-strategies/publishing-strategy';
import DotNetProject from '../utils/dotnet-project';
import { PackageVersionInfo, parseVersionsList } from '../version/nuget-versions-parser';
import { sort } from '../version/version-sorter';
import { getPackageVersions } from '../utils/nuget';

export class NugetPackageSet extends PackageSet {
  getLocalPackageVersion(): string | undefined {
    const dotNetProject = new DotNetProject(this.projectsInfo[0].csprojFilePath);
    return dotNetProject.getPackageVersion();
  }

  getStrategy(options: PublishingOptions): PublishingStrategy {
    return new DotNetPublishingStrategy(options);
  }

  async getPublishedVersions(): Promise<PackageVersionInfo[]> {
    const packageName = this.projectsInfo[0].name;
    const commandResult = await getPackageVersions(packageName);
    return commandResult.isSuccess && commandResult.data
      ? parseVersionsList(commandResult.data, packageName).sort(sort)
      : [];
  }
}
