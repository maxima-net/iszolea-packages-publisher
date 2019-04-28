import { PublishingStrategy, PublishingOptions } from '.';
import PublishingStrategyBase from './publishing-strategy-base';
import NpmPackageHelper from '../utils/npm-package-helper';
import { Constants } from '../utils/path-helper';
import { PublishingInfo } from '../store/types';

export default class NpmPublishingStrategy extends PublishingStrategyBase implements PublishingStrategy {
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

    if (!publishingInfo.isExecuting) {
      return publishingInfo;
    }

    publishingInfo = await this.applyNewVersion(publishingInfo);
    if (!publishingInfo.isExecuting) {
      return publishingInfo;
    }

    publishingInfo = await this.createCommitWithTags(publishingInfo);
    if (!publishingInfo.isExecuting) {
      return publishingInfo;
    }

    publishingInfo = await this.pushPackage(publishingInfo);
    return publishingInfo;
  }

  protected getVersionTag(packageName: string, version: string): string {
    if (packageName === Constants.IszoleaUIPackageName) {
      return version;
    }
    return super.getVersionTag(packageName, version);
  }

  private async applyNewVersion(prevPublishingInfo: PublishingInfo): Promise<PublishingInfo> {
    let isVersionApplied = true;

    for (const project of this.packageSet.projectsInfo) {
      if (project.name === Constants.IszoleaUIPackageName) {
        isVersionApplied = isVersionApplied && NpmPackageHelper.applyNewVersion(this.newVersion, this.uiPackageJsonPath);
      } else {
        isVersionApplied = false;
      }
    }

    let publishingInfo: PublishingInfo = {
      ...prevPublishingInfo,
      isVersionApplied
    }
    this.onPublishingInfoChange(publishingInfo);

    if (!isVersionApplied) {
      publishingInfo = await this.rejectLocalChanges(publishingInfo, 'The new versions are not applied');
    }

    return publishingInfo;
  }

  private async pushPackage(prevPublishingInfo: PublishingInfo): Promise<PublishingInfo> {
    let isPackagePublished = true;
    for (const project of this.packageSet.projectsInfo) {
      isPackagePublished = isPackagePublished && await NpmPackageHelper.publishPackage(
        project.dir, this.npmAutoLogin, this.npmLogin, this.npmPassword, this.npmEmail);
    }
    let publishingInfo: PublishingInfo = {
      ...prevPublishingInfo,
      isPackagePublished
    }
    this.onPublishingInfoChange(publishingInfo);

    if (!isPackagePublished) {
      publishingInfo = {
        ...publishingInfo,
        error: this.getPublishingErrorText()
      }
      this.onPublishingInfoChange(publishingInfo);
      publishingInfo = await this.removeLastCommitAndTags(publishingInfo);
    }

    return publishingInfo;
  }

  private getPublishingErrorText(): string {
    const body = this.npmAutoLogin ? 'Check npm credentials' : 'Check if you are logged in manually or enable auto login in settings';
    return `The package is not published. ${body}. See a log file for details`;
  }

  async rejectPublishing(prevPublishingInfo: PublishingInfo): Promise<void> {
    let publishingInfo: PublishingInfo = {
      ...prevPublishingInfo,
      isExecuting: true
    }
    this.onPublishingInfoChange(publishingInfo);

    for (const project of this.packageSet.projectsInfo) {
      await NpmPackageHelper.unPublishPackage(project.name, this.newVersion);
    }
    await this.removeLastCommitAndTags(publishingInfo);
  }
}
