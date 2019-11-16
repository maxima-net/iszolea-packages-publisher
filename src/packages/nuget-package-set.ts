import PackageSet from './package-set';
import { PublishingOptions } from '../publishing-strategies/publishing-options';
import DotNetPublishingStrategy from '../publishing-strategies/dotnet-publishing-strategy';
import PublishingStrategy from '../publishing-strategies/publishing-strategy';
import DotNetProject from '../utils/dotnet-project';
import { getProjectFilePath } from '../utils/path';

export class NugetPackageSet extends PackageSet {
  getLocalPackageVersion(): string | undefined {
    const projectPath = getProjectFilePath(this.baseFolderPath, this.projectsInfo[0].name);
    const dotNetProject = new DotNetProject(projectPath);
    return dotNetProject.getPackageVersion();
  }

  getStrategy(options: PublishingOptions): PublishingStrategy {
    return new DotNetPublishingStrategy(options);
  }
}
