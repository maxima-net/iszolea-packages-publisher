import { PublishingOptions } from './publishing-options';
import { PublishingInfo } from '../store/types';
import { PublishingGlobalStage } from '../store/publishing/types';
import PublishingStrategy from './publishing-strategy';
import ApplyNewNugetVersionStep from './publishing-steps/nuget/apply-new-nuget-version-step';
import BuildDotnetProjectStep from './publishing-steps/nuget/build-dotnet-project-step';
import PushNugetPackageStep from './publishing-steps/nuget/push-nuget-package-step';
import RejectNugetPublishingStep from './publishing-steps/nuget/reject-nuget-publishing-step';
import VersionTagGenerator from './version-tag-generators/version-tag-generator';

export default class DotNetPublishingStrategy extends PublishingStrategy {
  private readonly nuGetApiKey: string;

  constructor(options: PublishingOptions) {
    super(options.packageSet, options.newVersion, options.onPublishingInfoChange, new VersionTagGenerator());

    this.nuGetApiKey = options.settings.nuGetApiKey;
  }

  public async publish(prevPublishingInfo: PublishingInfo): Promise<PublishingInfo> {
    let publishingInfo = await this.checkIsEverythingCommitted(prevPublishingInfo);

    if (publishingInfo.globalStage !== PublishingGlobalStage.Publishing) {
      return publishingInfo;
    }

    publishingInfo = await this.applyNewVersion(publishingInfo);
    if (publishingInfo.globalStage !== PublishingGlobalStage.Publishing) {
      return publishingInfo;
    }

    publishingInfo = await this.buildProject(publishingInfo);
    if (publishingInfo.globalStage !== PublishingGlobalStage.Publishing) {
      return publishingInfo;
    }

    publishingInfo = await this.pushPackage(publishingInfo);
    if (publishingInfo.globalStage !== PublishingGlobalStage.Publishing) {
      return publishingInfo;
    }

    publishingInfo = await this.createCommitWithTags(publishingInfo);
    return publishingInfo;
  }

  async rejectPublishing(prevPublishingInfo: PublishingInfo): Promise<void> {
    const step = new RejectNugetPublishingStep(this.packageSet, prevPublishingInfo, this.onPublishingInfoChange,
      this.versionTagGenerator, this.newVersion, this.nuGetApiKey);
    await step.execute();
  }

  private async applyNewVersion(publishingInfo: PublishingInfo): Promise<PublishingInfo> {
    const step = new ApplyNewNugetVersionStep(this.packageSet, publishingInfo, this.onPublishingInfoChange,
      this.versionTagGenerator, this.newVersion);
    return step.execute();
  }

  private async buildProject(publishingInfo: PublishingInfo): Promise<PublishingInfo> {
    const step = new BuildDotnetProjectStep(this.packageSet, publishingInfo, this.onPublishingInfoChange,
      this.versionTagGenerator);
    return step.execute();
  }

  private async pushPackage(publishingInfo: PublishingInfo): Promise<PublishingInfo> {
    const step = new PushNugetPackageStep(this.packageSet, publishingInfo, this.onPublishingInfoChange,
      this.versionTagGenerator, this.newVersion, this.nuGetApiKey);
    return step.execute();
  }
}
