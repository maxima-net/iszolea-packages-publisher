import ProjectInfo from './project-info';
import { PublishingOptions, PublishingStrategy } from '../publishing-strategies';

export default abstract class PackageSet {
  id: number;
  projectsInfo: ProjectInfo[];
  baseFolderPath: string;

  constructor(id: number, projectsInfo: ProjectInfo[], baseFolderPath: string) {
    this.id = id;
    this.projectsInfo = projectsInfo;
    this.baseFolderPath = baseFolderPath;
  }

  abstract getLocalPackageVersion(): string | undefined;
  abstract getStrategy(options: PublishingOptions): PublishingStrategy;
}
