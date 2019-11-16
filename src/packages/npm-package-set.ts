import PackageSet from './package-set';
import { PublishingOptions } from '../publishing-strategies/publishing-options';
import NpmPublishingStrategy from '../publishing-strategies/npm-publishing-strategy';
import PublishingStrategy from '../publishing-strategies/publishing-strategy';
import NpmProject from '../utils/npm-project';

export class NpmPackageSet extends PackageSet {
  getLocalPackageVersion(): string | undefined {
    const npmProject = new NpmProject(this.baseFolderPath);
    return npmProject.getPackageVersion();
  }

  getStrategy(options: PublishingOptions): PublishingStrategy {
    return new NpmPublishingStrategy(options);
  }
}
