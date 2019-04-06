import { PublishingInfo } from '../Components/PublishExecutingView';
import { PackageSet } from '../utils/path-helper';
export { PublishingStrategyFactory } from './publishing-strategy-factory';

export interface PublishStrategy {
  publish(publishingInfo: PublishingInfo): Promise<PublishingInfo>;
  rejectPublishing(publishingInfo: PublishingInfo): Promise<void>;
}

export interface PublishingOptions {
  packageSet: PackageSet; 
  newVersion: string;
  baseSlnPath: string; 
  nuGetApiKey: string;
  onPublishingInfoChange: (publishingInfo: PublishingInfo) => void;
}
