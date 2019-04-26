import { PackageSet } from '../utils/path-helper';
import { Settings, PublishingInfo } from '../reducers/types';
export { PublishingStrategyFactory } from './publishing-strategy-factory';

export interface PublishingStrategy {
  publish(publishingInfo: PublishingInfo): Promise<PublishingInfo>;
  rejectPublishing(publishingInfo: PublishingInfo): Promise<void>;
}

export interface PublishingOptions {
  packageSet: PackageSet; 
  newVersion: string;
  settings: Settings;
  onPublishingInfoChange: (publishingInfo: PublishingInfo) => void;
}
