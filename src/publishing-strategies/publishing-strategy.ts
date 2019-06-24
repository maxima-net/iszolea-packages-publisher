import { PublishingInfo } from '../store/types';
import PackageSet from '../packages/package-set';
import CheckIsCommittedStep from './publishing-steps/check-is-committed-step';
import CreateCommitWithTagsStep from './publishing-steps/create-commit-with-tags-step';
import VersionTagGenerator from './version-tag-generators/version-tag-generator';
import PublishingStep from './publishing-steps/publishing-step';
import { PublishingGlobalStage } from '../store/publishing/types';

export default abstract class PublishingStrategy {
  protected readonly packageSet: PackageSet;
  protected readonly newVersion: string;
  protected readonly versionTagGenerator: VersionTagGenerator;

  protected readonly onPublishingInfoChange: (publishingInfo: PublishingInfo) => void;

  constructor(packageSet: PackageSet, newVersion: string, onPublishingInfoChange: (publishingInfo: PublishingInfo) => void,
    versionTagGenerator: VersionTagGenerator) {
    this.packageSet = packageSet;
    this.newVersion = newVersion;
    this.onPublishingInfoChange = onPublishingInfoChange;
    this.versionTagGenerator = versionTagGenerator;
  }

  async publish(publishingInfo: PublishingInfo): Promise<PublishingInfo> {
    const steps = this.getPublishingSteps();

    for (const step of steps) {
      publishingInfo = await step.execute(publishingInfo);
      if (publishingInfo.globalStage !== PublishingGlobalStage.Publishing) {
        return publishingInfo;
      }
    }

    return publishingInfo;
  }

  async rejectPublishing(publishingInfo: PublishingInfo): Promise<void> {
    const steps = this.getRejectingSteps();

    for (const step of steps) {
      await step.execute(publishingInfo);
    }
  }

  protected abstract getPublishingSteps(): PublishingStep[];
  protected abstract getRejectingSteps(): PublishingStep[];

  protected createCheckIsCommittedStep(): PublishingStep {
    return new CheckIsCommittedStep(this.packageSet, this.onPublishingInfoChange, this.versionTagGenerator);
  }

  protected createCreateCommitWithTagsStep(): PublishingStep {
    return new CreateCommitWithTagsStep(this.packageSet, this.onPublishingInfoChange, this.versionTagGenerator, this.newVersion);
  }
}
