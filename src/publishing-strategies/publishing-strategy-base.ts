import GitHelper from '../utils/git-helper';
import { PackageSet } from '../utils/path-helper';
import { PublishingInfo } from '../store/types';

export default class PublishingStrategyBase {
  protected readonly packageSet: PackageSet;
  protected readonly newVersion: string;

  protected readonly onPublishingInfoChange: (publishingInfo: PublishingInfo) => void;

  constructor(packageSet: PackageSet, newVersion: string, onPublishingInfoChange: (publishingInfo: PublishingInfo) => void) {
    this.packageSet = packageSet;
    this.newVersion = newVersion;
    this.onPublishingInfoChange = onPublishingInfoChange;
  }

  protected async checkIsEverythingCommitted(prevPublishingInfo: PublishingInfo): Promise<PublishingInfo> {
    const isEverythingCommitted = await GitHelper.isEverythingCommitted(this.packageSet.projectsInfo[0].dir)
    let publishingInfo: PublishingInfo = {
      ...prevPublishingInfo,
      isEverythingCommitted
    };

    this.onPublishingInfoChange(publishingInfo);

    if (!isEverythingCommitted) {
      publishingInfo = await this.rejectLocalChanges(publishingInfo, 'The git repository has unsaved changes. Commit or remove them');
    }

    return publishingInfo;
  }

  protected async createCommitWithTags(prevPublishingInfo: PublishingInfo): Promise<PublishingInfo> {
    for (const project of this.packageSet.projectsInfo) {
      await GitHelper.stageFiles(project.dir);
    }
    const projectDirPath = this.packageSet.projectsInfo[0].dir;
    const tags = this.getVersionTags();
    const isCommitMade = await GitHelper.createCommitWithTags(projectDirPath, tags);
    let publishingInfo: PublishingInfo = {
      ...prevPublishingInfo,
      isCommitMade
    }
    this.onPublishingInfoChange(publishingInfo);

    if (!isCommitMade) {
      publishingInfo = await this.rejectLocalChanges(publishingInfo, 'The result commit is not created');
    }

    return publishingInfo;
  }

  protected getVersionTags(): string[] {
    const packages = this.packageSet.projectsInfo.map((i) => i.name);
    return packages.map(p => {
      return this.getVersionTag(p, this.newVersion);
    });
  }

  protected getVersionTag(packageName: string, version: string): string {
    return `${packageName}.${version}`;
  }

  protected async rejectLocalChanges(prevPublishingInfo: PublishingInfo, error: string): Promise<PublishingInfo> {
    await GitHelper.resetChanges(this.packageSet.projectsInfo[0].dir)
    const publishingInfo: PublishingInfo = {
      ...prevPublishingInfo,
      error,
      isRejected: true,
      isRejectAllowed: false,
      isExecuting: false
    };
    this.onPublishingInfoChange(publishingInfo);

    return publishingInfo;
  }

  protected async removeLastCommitAndTags(prevPublishingInfo: PublishingInfo): Promise<PublishingInfo> {
    const projectDirPath = this.packageSet.projectsInfo[0].dir;
    await GitHelper.removeLastCommitAndTags(projectDirPath, this.getVersionTags());
    const publishingInfo = {
      ...prevPublishingInfo,
      isRejected: true,
      isRejectAllowed: false,
      isExecuting: false
    };
    this.onPublishingInfoChange(publishingInfo);
    return publishingInfo;
  }
}
