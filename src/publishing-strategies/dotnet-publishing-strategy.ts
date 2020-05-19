import { PublishingOptions } from './publishing-options';
import PublishingStrategy from './publishing-strategy';
import ApplyNewNugetVersionStep from './publishing-steps/nuget/apply-new-nuget-version-step';
import BuildDotnetProjectStep from './publishing-steps/nuget/build-dotnet-project-step';
import PushNugetPackageStep from './publishing-steps/nuget/push-nuget-package-step';
import RejectNugetPublishingStep from './publishing-steps/nuget/reject-nuget-publishing-step';
import VersionTagGenerator from './version-tag-generators/version-tag-generator';
import PublishingStep from './publishing-steps/publishing-step';
import NugetVersionConvertor from '../version/nuget-version-convertor';

export default class DotNetPublishingStrategy extends PublishingStrategy {
  private readonly nuGetApiKey: string;

  constructor(options: PublishingOptions) {
    super(options.packageSet, options.newVersion, options.onPublishingInfoChange, new VersionTagGenerator());

    this.nuGetApiKey = options.settings.nuGetApiKey;
  }

  protected getPublishingSteps(): PublishingStep[] {
    return [
      this.createCheckVersionUniquenessStep(),
      this.createCheckIsCommittedStep(),
      new ApplyNewNugetVersionStep(this.packageSet, this.onPublishingInfoChange, this.versionTagGenerator, this.newVersion, new NugetVersionConvertor()),
      new BuildDotnetProjectStep(this.packageSet, this.onPublishingInfoChange, this.versionTagGenerator),
      new PushNugetPackageStep(this.packageSet, this.onPublishingInfoChange, this.versionTagGenerator, this.newVersion, this.nuGetApiKey),
      this.createCreateCommitWithTagsStep()
    ];
  }

  protected getRejectingSteps(): PublishingStep[] {
    return [
      new RejectNugetPublishingStep(this.packageSet, this.onPublishingInfoChange, this.versionTagGenerator, this.newVersion, this.nuGetApiKey)
    ];
  }
}
