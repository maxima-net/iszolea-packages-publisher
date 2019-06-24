import { PublishingOptions } from './publishing-options';
import { applyNewVersion, publishPackage, unPublishPackage } from '../utils/npm-package';
import { Constants } from '../utils/path';
import { PublishingInfo } from '../store/types';
import { PublishingStage, PublishingStageStatus, PublishingGlobalStage } from '../store/publishing/types';
import PublishingStrategy from './publishing-strategy';

export default class NpmPublishingStrategy extends PublishingStrategy {
  private readonly uiPackageJsonPath: string;
  private readonly npmAutoLogin: boolean;
  private readonly npmLogin: string;
  private readonly npmPassword: string;
  private readonly npmEmail: string;

  constructor(options: PublishingOptions) {
    super(options.packageSet, options.newVersion, options.onPublishingInfoChange);

    this.uiPackageJsonPath = options.settings.uiPackageJsonPath;
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

  async rejectPublishing(prevPublishingInfo: PublishingInfo): Promise<void> {
    let publishingInfo: PublishingInfo = {
      ...prevPublishingInfo,
      globalStage: PublishingGlobalStage.Rejecting,
      stages: this.stageGenerator.addStage(
        prevPublishingInfo.stages,
        PublishingStage.Reject,
        PublishingStageStatus.Executing,
      )
    }
    this.onPublishingInfoChange(publishingInfo);

    for (const project of this.packageSet.projectsInfo) {
      await unPublishPackage(project.name, this.newVersion);
    }
    await this.removeLastCommitAndTags(publishingInfo);

    publishingInfo = {
      ...publishingInfo,
      globalStage: PublishingGlobalStage.Rejected,
      stages: this.stageGenerator.addStage(
        publishingInfo.stages,
        PublishingStage.Reject,
        PublishingStageStatus.Finished,
      )
    }
    this.onPublishingInfoChange(publishingInfo);
  }

  protected getVersionTag(packageName: string, version: string): string {
    if (packageName === Constants.IszoleaUIPackageName) {
      return version;
    }
    return super.getVersionTag(packageName, version);
  }

  private async applyNewVersion(prevPublishingInfo: PublishingInfo): Promise<PublishingInfo> {
    let isVersionApplied = true;

    let publishingInfo: PublishingInfo = {
      ...prevPublishingInfo,
      stages: this.stageGenerator.addStage(
        prevPublishingInfo.stages,
        PublishingStage.ApplyVersion,
        PublishingStageStatus.Executing,
      )
    };

    for (const project of this.packageSet.projectsInfo) {
      if (project.name === Constants.IszoleaUIPackageName) {
        isVersionApplied = isVersionApplied && applyNewVersion(this.newVersion, this.uiPackageJsonPath);
      } else {
        isVersionApplied = false;
      }
    }

    publishingInfo = {
      ...publishingInfo,
      stages: this.stageGenerator.addStage(
        publishingInfo.stages,
        PublishingStage.ApplyVersion,
        isVersionApplied ? PublishingStageStatus.Finished : PublishingStageStatus.Failed,
      )
    }
    this.onPublishingInfoChange(publishingInfo);

    if (!isVersionApplied) {
      publishingInfo = await this.rejectLocalChanges(publishingInfo, 'The new versions are not applied');
    }

    return publishingInfo;
  }

  private async pushPackage(prevPublishingInfo: PublishingInfo): Promise<PublishingInfo> {
    let publishingInfo: PublishingInfo = {
      ...prevPublishingInfo,
      stages: this.stageGenerator.addStage(
        prevPublishingInfo.stages,
        PublishingStage.PublishPackage,
        PublishingStageStatus.Executing,
      )
    }
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
    }
    this.onPublishingInfoChange(publishingInfo);

    if (!isPackagePublished) {
      publishingInfo = {
        ...publishingInfo,
        globalStage: PublishingGlobalStage.Rejecting,
        error: this.getPublishingErrorText()
      }
      this.onPublishingInfoChange(publishingInfo);

      await this.removeLastCommitAndTags(publishingInfo);

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
