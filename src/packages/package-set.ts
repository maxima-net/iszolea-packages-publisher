import ProjectInfo from './project-info';
import { PublishingOptions } from '../publishing-strategies/publishing-options';
import PublishingStrategy from '../publishing-strategies/publishing-strategy';
import { PackageVersionInfo } from '../version/nuget-versions-parser';

export default abstract class PackageSet {
  readonly projectsInfo: ProjectInfo[];
  readonly baseFolderPath: string;

  constructor(projectsInfo: ProjectInfo[], baseFolderPath: string) {
    this.projectsInfo = projectsInfo;
    this.baseFolderPath = baseFolderPath;
  }

  abstract getLocalPackageVersion(): string | undefined;
  abstract getStrategy(options: PublishingOptions): PublishingStrategy;
  abstract getPublishedVersions(): Promise<PackageVersionInfo[]>;

}
