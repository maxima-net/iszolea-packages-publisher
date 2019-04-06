import { PublishingStrategy, PublishingOptions } from '.';
import { PublishingInfo } from '../Components/PublishExecutingView';
import PublishingStrategyBase from './publishing-strategy-base';
import NpmPackageHelper from '../utils/npm-package-helper';
import { Constants } from '../utils/path-helper';

export default class NpmPublishingStrategy extends PublishingStrategyBase implements PublishingStrategy {
  private readonly uiPackageJsonPath: string;

  constructor(options: PublishingOptions) {
    super(options.packageSet, options.newVersion, options.onPublishingInfoChange);

    this.uiPackageJsonPath = options.uiPackageJsonPath;
  }

  async publish(publishingInfo: PublishingInfo): Promise<PublishingInfo> {
    publishingInfo = await this.checkIsEverythingCommitted(publishingInfo);

    if (!publishingInfo.isExecuting) {
      return publishingInfo;
    }

    publishingInfo = await this.applyNewVersion(publishingInfo);
    if (!publishingInfo.isExecuting) {
      return publishingInfo;
    }

    publishingInfo = await this.createCommitWithTags(publishingInfo);
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


  async rejectPublishing(publishingInfo: PublishingInfo): Promise<void> {
    await this.removeLastCommitAndTags(publishingInfo);
  }
}
