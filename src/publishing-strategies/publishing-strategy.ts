import { PublishingInfo } from '../store/types';
import PackageSet from '../packages/package-set';
import CheckIsCommittedStep from './publishing-steps/check-is-committed-step';
import CreateCommitWithTagsStep from './publishing-steps/create-commit-with-tags-step';
import VersionTagGenerator from './version-tag-generators/version-tag-generator';

export default abstract class PublishingStrategy {
  protected readonly packageSet: PackageSet;
  protected readonly newVersion: string;
  protected readonly versionTagGenerator: VersionTagGenerator;

  protected readonly onPublishingInfoChange: (publishingInfo: PublishingInfo) => void;

  constructor(packageSet: PackageSet, newVersion: string, onPublishingInfoChange: (publishingInfo: PublishingInfo) => void,
    versionTagGenerator: VersionTagGenerator)
  {
    this.packageSet = packageSet;
    this.newVersion = newVersion;
    this.onPublishingInfoChange = onPublishingInfoChange;
    this.versionTagGenerator = versionTagGenerator;
  }

  abstract publish(publishingInfo: PublishingInfo): Promise<PublishingInfo>;
  abstract rejectPublishing(publishingInfo: PublishingInfo): Promise<void>;

  protected async checkIsEverythingCommitted(publishingInfo: PublishingInfo): Promise<PublishingInfo> {
    const step = new CheckIsCommittedStep(this.packageSet, publishingInfo, this.onPublishingInfoChange, this.versionTagGenerator);
    return step.execute();
  }

  protected async createCommitWithTags(publishingInfo: PublishingInfo): Promise<PublishingInfo> {
    const step = new CreateCommitWithTagsStep(this.packageSet, publishingInfo, this.onPublishingInfoChange, this.versionTagGenerator, this.newVersion);
    return step.execute();
  }
}
