import PackageSet from './package-set';
import { getLocalPackageVersion } from '../utils/npm-package';
import { PublishingOptions } from '../publishing-strategies/publishing-options';
import NpmPublishingStrategy from '../publishing-strategies/npm-publishing-strategy';
import PublishingStrategy from '../publishing-strategies/publishing-strategy';

export class NpmPackageSet extends PackageSet {
  getLocalPackageVersion(): string | undefined {
    return getLocalPackageVersion(this.baseFolderPath);
  }

  getStrategy(options: PublishingOptions): PublishingStrategy {
    return new NpmPublishingStrategy(options);
  }
}
