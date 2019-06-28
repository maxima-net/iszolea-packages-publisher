import ProjectInfo from './project-info';
import { PublishingOptions } from '../publishing-strategies/publishing-options';
import PublishingStrategy from '../publishing-strategies/publishing-strategy';

export default abstract class PackageSet {
  readonly projectsInfo: ProjectInfo[];
  readonly baseFolderPath: string;

  constructor(projectsInfo: ProjectInfo[], baseFolderPath: string) {
    this.projectsInfo = projectsInfo;
    this.baseFolderPath = baseFolderPath;
  }

  abstract getLocalPackageVersion(): string | undefined;
  abstract getStrategy(options: PublishingOptions): PublishingStrategy;

  get isOnePackage() {
    return this.projectsInfo.length === 1;
  }
}
