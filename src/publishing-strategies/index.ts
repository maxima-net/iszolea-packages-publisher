import { PublishingInfo } from '../Components/PublishExecutingView';
import { PackageSet } from '../utils/path-helper';
export { PublishingStrategyFactory } from './publishing-strategy-factory';

export interface PublishingStrategy {
  publish(publishingInfo: PublishingInfo): Promise<PublishingInfo>;
  rejectPublishing(publishingInfo: PublishingInfo): Promise<void>;
}

export interface PublishingOptions {
  packageSet: PackageSet; 
  newVersion: string;
  baseSlnPath: string; 
  uiPackageJsonPath: string;
  nuGetApiKey: string;
  onPublishingInfoChange: (publishingInfo: PublishingInfo) => void;
}
