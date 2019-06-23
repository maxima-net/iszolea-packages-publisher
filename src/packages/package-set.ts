import ProjectInfo from './project-info';
import { PublishingOptions, PublishingStrategy } from '../publishing-strategies';

export default abstract class PackageSet {
  projectsInfo: ProjectInfo[];
  baseFolderPath: string;

  constructor(projectsInfo: ProjectInfo[], baseFolderPath: string) {
    this.projectsInfo = projectsInfo;
    this.baseFolderPath = baseFolderPath;
  }

  abstract getLocalPackageVersion(): string | undefined;
  abstract getStrategy(options: PublishingOptions): PublishingStrategy;
}
