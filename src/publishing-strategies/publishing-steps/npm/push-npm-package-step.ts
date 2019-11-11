import PublishingStep from '../publishing-step';
import { PublishingInfo } from '../../../store/types';
import { PublishingStageStatus, PublishingStage, PublishingGlobalStage } from '../../../store/publishing/types';
import PackageSet from '../../../packages/package-set';
import { publishPackage } from '../../../utils/npm-package';
import VersionTagGenerator from '../../version-tag-generators/version-tag-generator';

export default class PushNpmPackageStep extends PublishingStep {
  private readonly newVersion: string;
  private readonly npmAutoLogin: boolean;
  private readonly npmLogin: string;
  private readonly npmPassword: string;
  private readonly npmEmail: string;

  constructor(packageSet: PackageSet, onPublishingInfoChange: (publishingInfo: PublishingInfo) => void, 
    versionTagGenerator: VersionTagGenerator, newVersion: string, npmAutoLogin: boolean, npmLogin: string, npmPassword: string, npmEmail: string)
  {
    super(packageSet, onPublishingInfoChange, versionTagGenerator);
    this.newVersion = newVersion;
    this.npmAutoLogin = npmAutoLogin;
    this.npmLogin = npmLogin;
    this.npmPassword = npmPassword;
    this.npmEmail = npmEmail;
  }
  
  async execute(publishingInfo: PublishingInfo): Promise<PublishingInfo> {
    publishingInfo = {
      ...publishingInfo,
      stages: this.stageGenerator.addStage(
        publishingInfo.stages,
        PublishingStage.PublishPackage,
        PublishingStageStatus.Executing,
      )
    };
    this.onPublishingInfoChange(publishingInfo);

    let isPackagePublished = true;
    for (const project of this.packageSet.projectsInfo) {
      isPackagePublished = isPackagePublished && await publishPackage(
        project.dir, this.npmAutoLogin, this.npmLogin, this.npmPassword, this.npmEmail);
    }

    publishingInfo = {
      ...publishingInfo,
      stages: this.stageGenerator.addStage(
        publishingInfo.stages,
        PublishingStage.PublishPackage,
        isPackagePublished ? PublishingStageStatus.Finished : PublishingStageStatus.Failed,
      )
    };
    this.onPublishingInfoChange(publishingInfo);

    if (!isPackagePublished) {
      publishingInfo = {
        ...publishingInfo,
        globalStage: PublishingGlobalStage.Rejecting,
        error: this.getPublishingErrorText()
      };
      this.onPublishingInfoChange(publishingInfo);

      await this.removeLastCommitAndTags(this.newVersion);

      publishingInfo = {
        ...publishingInfo,
        globalStage: PublishingGlobalStage.Rejected
      };
      this.onPublishingInfoChange(publishingInfo);
    }

    return publishingInfo;
  }

  private getPublishingErrorText(): string {
    const body = this.npmAutoLogin ? 'Check npm credentials' : 'Check if you are logged in manually or enable auto login in settings';
    return `The package is not published. ${body}. See a log file for details`;
  }
}
