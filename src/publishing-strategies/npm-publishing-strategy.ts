import { PublishingStrategy, PublishingOptions } from '.';
import { PublishingInfo } from '../Components/PublishExecutingView';
import PublishingStrategyBase from './publishing-strategy-base';
import NpmPackageHelper from '../utils/npm-package-helper';
import { Constants } from '../utils/path-helper';

export default class NpmPublishingStrategy extends PublishingStrategyBase implements PublishingStrategy {
  private readonly uiPackageJsonPath: string;
  private readonly npmLogin: string;
  private readonly npmPassword: string;
  private readonly npmEmail: string;

  constructor(options: PublishingOptions) {
    super(options.packageSet, options.newVersion, options.onPublishingInfoChange);

    this.uiPackageJsonPath = options.uiPackageJsonPath;
    this.npmLogin = options.npmLogin;
    this.npmPassword = options.npmPassword;
    this.npmEmail = options.npmEmail;
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
        project.dir, this.npmLogin, this.npmPassword, this.npmEmail);
    }
    let publishingInfo: PublishingInfo = {
      ...prevPublishingInfo,
      isPackagePublished
    }
    this.onPublishingInfoChange(publishingInfo);

    if (!isPackagePublished) {
      publishingInfo = {
        ...publishingInfo,
        error: 'The package is not published. Check npm credentials. See a log file for details'
      }
      this.onPublishingInfoChange(publishingInfo);
      publishingInfo = await this.removeLastCommitAndTags(publishingInfo);
    }

    return publishingInfo;
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
