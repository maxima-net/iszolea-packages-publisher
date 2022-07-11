import { NugetPackageConfig } from './nugetPackageConfig';

export interface SolutionConfig {
  displayedName: string;
  slnFileName: string;
  packages: { [key: string]: NugetPackageConfig };
}