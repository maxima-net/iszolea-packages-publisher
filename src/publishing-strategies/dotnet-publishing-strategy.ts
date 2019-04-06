import { PublishStrategy, PublishingOptions } from '.';
import { PublishingInfo } from '../Components/PublishExecutingView';
import GitHelper from '../utils/git-helper';
import PathHelper, { PackageSet } from '../utils/path-helper';
import { VersionHelper } from '../utils/version-helper';
import DotNetProjectHelper from '../utils/dotnet-project-helper';
import NuGetHelper from '../utils/nuget-helper';

export default class DotNetPublishingStrategy implements PublishStrategy {
  private readonly packageSet: PackageSet;
  private readonly newVersion: string;
  private readonly baseSlnPath: string;
  private readonly nuGetApiKey: string;
  private readonly onPublishingInfoChange: (publishingInfo: PublishingInfo) => void;

  constructor(options: PublishingOptions) {
    this.packageSet = options.packageSet;
    this.newVersion = options.newVersion;
    this.baseSlnPath = options.baseSlnPath;
    this.nuGetApiKey = options.nuGetApiKey;
    this.onPublishingInfoChange = options.onPublishingInfoChange;
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

    publishingInfo = await this.buildProject(publishingInfo);
    if (!publishingInfo.isExecuting) {
      return publishingInfo;
    }

    publishingInfo = await this.pushPackage(publishingInfo);
    if (!publishingInfo.isExecuting) {
      return publishingInfo;
    }

    publishingInfo = await this.createCommitWithTags(publishingInfo);
    return publishingInfo;
  }

  private async checkIsEverythingCommitted(prevPublishingInfo: PublishingInfo): Promise<PublishingInfo> {
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

  private async applyNewVersion(prevPublishingInfo: PublishingInfo): Promise<PublishingInfo> {
    let isVersionApplied = true;

    for (const project of this.packageSet.projectsInfo) {

      const assemblyAndFileVersion = VersionHelper.getFileAndAssemblyVersion(this.newVersion);

      if (!assemblyAndFileVersion) {
        return await this.rejectLocalChanges(prevPublishingInfo, 'AssemblyAndFileVersion has not been found');
      }

      isVersionApplied = isVersionApplied && DotNetProjectHelper.applyNewVersion(this.newVersion, assemblyAndFileVersion, this.baseSlnPath, project.name);
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

  private async buildProject(prevPublishingInfo: PublishingInfo): Promise<PublishingInfo> {
    let isBuildCompleted = true;
    for (const project of this.packageSet.projectsInfo) {
      isBuildCompleted = isBuildCompleted && await DotNetProjectHelper.build(PathHelper.getProjectFilePath(this.baseSlnPath, project.name));
    }
    let publishingInfo: PublishingInfo = {
      ...prevPublishingInfo,
      isBuildCompleted
    }
    this.onPublishingInfoChange(publishingInfo);

    if (!isBuildCompleted) {
      publishingInfo = await this.rejectLocalChanges(publishingInfo, 'The project is not built. See a log file for details');
    }

    return publishingInfo;
  }

  private async pushPackage(prevPublishingInfo: PublishingInfo): Promise<PublishingInfo> {
    let isPackagePublished = true;
    for (const project of this.packageSet.projectsInfo) {
      const nupkgFilePath = PathHelper.getNupkgFilePath(this.baseSlnPath, project.name, this.newVersion);
      isPackagePublished = isPackagePublished && await NuGetHelper.pushPackage(nupkgFilePath, this.nuGetApiKey);
    }
    let publishingInfo: PublishingInfo = {
      ...prevPublishingInfo,
      isPackagePublished
    }
    this.onPublishingInfoChange(publishingInfo);

    if (!isPackagePublished) {
      publishingInfo = await this.rejectLocalChanges(publishingInfo, 'The package is not published. Check an API key and connection. See a log file for details');
    }

    return publishingInfo;
  }

  private async createCommitWithTags(prevPublishingInfo: PublishingInfo): Promise<PublishingInfo> {
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

  private async rejectLocalChanges(prevPublishingInfo: PublishingInfo, error: string): Promise<PublishingInfo> {
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

  async rejectPublishing(prevPublishingInfo: PublishingInfo): Promise<void> {
    let publishingInfo: PublishingInfo = {
      ...prevPublishingInfo,
      isExecuting: true
    }
    this.onPublishingInfoChange(publishingInfo);

    for (const project of this.packageSet.projectsInfo) {
      await NuGetHelper.deletePackage(project.name, this.newVersion, this.nuGetApiKey);
    }

    const projectDirPath = this.packageSet.projectsInfo[0].dir;
    await GitHelper.removeLastCommitAndTags(projectDirPath, this.getVersionTags());
    publishingInfo = {
      ...publishingInfo,
      isRejected: true,
      isRejectAllowed: false,
      isExecuting: false
    };
    this.onPublishingInfoChange(publishingInfo);
  }

  private getVersionTags(): string[] {
    const packages = this.packageSet.projectsInfo.map((i) => i.name);
    return packages.map(p => {
      return `${p}.${this.newVersion}`
    });
  }
}
