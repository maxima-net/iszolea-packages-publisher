import { PublishingOptions } from './publishing-options';
import PublishingStrategy from './publishing-strategy';
import ApplyNewNpmVersionStep from './publishing-steps/npm/apply-new-npm-version-step';
import PushNpmPackageStep from './publishing-steps/npm/push-npm-package-step';
import RejectNpmPublishingStep from './publishing-steps/npm/reject-npm-publishing-step';
import NpmVersionTagGenerator from './version-tag-generators/npm-version-tag-generator';
import PublishingStep from './publishing-steps/publishing-step';

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

  protected getPublishingSteps(): PublishingStep[] {
    return [
      this.createCheckVersionUniquenessStep(),
      this.createCheckIsCommittedStep(),
      new ApplyNewNpmVersionStep(this.packageSet, this.onPublishingInfoChange, this.versionTagGenerator, this.newVersion),
      this.createCreateCommitWithTagsStep(),
      new PushNpmPackageStep(this.packageSet, this.onPublishingInfoChange, this.versionTagGenerator, this.newVersion,
        this.npmAutoLogin, this.npmLogin, this.npmPassword, this.npmEmail)
    ];
  }

  protected getRejectingSteps(): PublishingStep[] {
    return [
      new RejectNpmPublishingStep(this.packageSet, this.onPublishingInfoChange, this.versionTagGenerator, this.newVersion)
    ];
  }
}
