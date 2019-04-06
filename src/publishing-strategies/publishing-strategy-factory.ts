import DotNetPublishingStrategy from './dotnet-publishing-strategy';
import { PublishStrategy, PublishingOptions } from '.';

export class PublishingStrategyFactory {
  getStrategy(options: PublishingOptions): PublishStrategy {
    if (options.packageSet.isNuget) {
      return new DotNetPublishingStrategy(options);
    }

    throw new Error('Not implemented');
  }
}
