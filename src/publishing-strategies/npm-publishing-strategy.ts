import { PublishingOptions } from './publishing-options';
import { PublishingInfo } from '../store/types';
import { PublishingGlobalStage } from '../store/publishing/types';
import PublishingStrategy from './publishing-strategy';
import { ApplyNewNpmVersionStep } from './publishing-steps/npm/apply-new-npm-version-step';
import PushNpmPackageStep from './publishing-steps/npm/push-npm-package-step';
import RejectNpmPublishingStep from './publishing-steps/npm/reject-npm-publishing-step';
import NpmVersionTagGenerator from './version-tag-generators/npm-version-tag-generator';

export default class NpmPublishingStrategy extends PublishingStrategy {
  private readonly npmAutoLogin: boolean;
  private readonly npmLogin: string;
  private readonly npmPassword: string;
  private readonly npmEmail: string;

  constructor(options: PublishingOptions) {
    super(options.packageSet, options.newVersion, options.onPublishingInfoChange, new NpmVersionTagGenerator());

    this.npmAutoLogin = options.settings.npmAutoLogin;
    this.npmLogin = options.settings.npmLogin;
    this.npmPassword = options.settings.npmPassword;
    this.npmEmail = options.settings.npmEmail;
  }

  async publish(prevPublishingInfo: PublishingInfo): Promise<PublishingInfo> {
    let publishingInfo = await this.checkIsEverythingCommitted(prevPublishingInfo);

    if (publishingInfo.globalStage !== PublishingGlobalStage.Publishing) {
      return publishingInfo;
    }

    publishingInfo = await this.applyNewVersion(publishingInfo);
    if (publishingInfo.globalStage !== PublishingGlobalStage.Publishing) {
      return publishingInfo;
    }

    publishingInfo = await this.createCommitWithTags(publishingInfo);
    if (publishingInfo.globalStage !== PublishingGlobalStage.Publishing) {
      return publishingInfo;
    }

    publishingInfo = await this.pushPackage(publishingInfo);
    return publishingInfo;
  }

  async rejectPublishing(publishingInfo: PublishingInfo): Promise<void> {
    const step = new RejectNpmPublishingStep(this.packageSet, publishingInfo, this.onPublishingInfoChange,
      this.versionTagGenerator, this.newVersion);
    await step.execute();
  }

  private async applyNewVersion(publishingInfo: PublishingInfo): Promise<PublishingInfo> {
    const step = new ApplyNewNpmVersionStep(this.packageSet, publishingInfo, this.onPublishingInfoChange,
      this.versionTagGenerator, this.newVersion);
    return step.execute();
  }

  private async pushPackage(publishingInfo: PublishingInfo): Promise<PublishingInfo> {
    const step = new PushNpmPackageStep(this.packageSet, publishingInfo, this.onPublishingInfoChange,
      this.versionTagGenerator, this.newVersion, this.npmAutoLogin, this.npmLogin, this.npmPassword, this.npmEmail);
    return step.execute();
  }
}
