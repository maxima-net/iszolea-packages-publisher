import PackageSet from './package-set';
import { getLocalPackageVersion } from '../utils/npm-package';
import { PublishingOptions, PublishingStrategy } from '../publishing-strategies';
import NpmPublishingStrategy from '../publishing-strategies/npm-publishing-strategy';

export class NpmPackageSet extends PackageSet {
  getLocalPackageVersion(): string | undefined {
    return getLocalPackageVersion(this.baseFolderPath);
  }

  getStrategy(options: PublishingOptions): PublishingStrategy {
    return new NpmPublishingStrategy(options);
  }
}
