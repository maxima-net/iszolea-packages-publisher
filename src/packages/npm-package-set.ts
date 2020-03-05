import PackageSet from './package-set';
import { PublishingOptions } from '../publishing-strategies/publishing-options';
import NpmPublishingStrategy from '../publishing-strategies/npm-publishing-strategy';
import PublishingStrategy from '../publishing-strategies/publishing-strategy';
import NpmProject from '../utils/npm-project';
import { PackageVersionInfo } from '../version/nuget-versions-parser';
import { getPackageVersions } from '../utils/npm';
import { parseVersionsList } from '../version/npm-versions-parser';
import { sort } from '../version/version-sorter';

export class NpmPackageSet extends PackageSet {
  getLocalPackageVersion(): string | undefined {
    const npmProject = new NpmProject(this.baseFolderPath);
    return npmProject.getPackageVersion();
  }

  getStrategy(options: PublishingOptions): PublishingStrategy {
    return new NpmPublishingStrategy(options);
  }

  async getPublishedVersions(): Promise<PackageVersionInfo[]> {
    const commandResult = await getPackageVersions(this.projectsInfo[0].name);
    return commandResult.isSuccess && commandResult.data
      ? parseVersionsList(commandResult.data).sort(sort)
      : [];
  }
}
