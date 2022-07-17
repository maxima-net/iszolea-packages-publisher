import { NpmPackageConfig } from './npmPackageConfig';
import { SolutionConfig } from './solutionConfig';

export interface AppConfig {
  links: {
    help: string;
    requirements: string;
  };
  texts: {
    confirmUnPublishingText: string;
  };
  nuget: {
    solutions: { [key: string]: SolutionConfig };
  };
  npm: {
    packages: { [key: string]: NpmPackageConfig };
  };
}