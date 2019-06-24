import { PublishingInfo, Settings } from '../store/types';
import PackageSet from '../packages/package-set';

export interface PublishingOptions {
  packageSet: PackageSet; 
  newVersion: string;
  settings: Settings;
  onPublishingInfoChange: (publishingInfo: PublishingInfo) => void;
}
