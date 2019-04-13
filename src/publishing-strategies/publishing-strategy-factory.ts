import DotNetPublishingStrategy from './dotnet-publishing-strategy';
import { PublishingStrategy, PublishingOptions } from '.';
import NpmPublishingStrategy from './npm-publishing-strategy';

export class PublishingStrategyFactory {
  getStrategy(options: PublishingOptions): PublishingStrategy {
    if (options.packageSet.isNuget) {
      return new DotNetPublishingStrategy(options);
    } else {
      return new NpmPublishingStrategy(options);
    }
  }
}
