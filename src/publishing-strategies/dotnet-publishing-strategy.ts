import { PublishingStrategy, PublishingOptions } from '.';
import { getProjectFilePath, getNupkgFilePath } from '../utils/path';
import { getFileAndAssemblyVersion } from '../utils/version';
import { applyNewVersion, build } from '../utils/dotnet-project';
import { pushPackage, deletePackage } from '../utils/nuget';
import PublishingStrategyBase from './publishing-strategy-base';
import { PublishingInfo } from '../store/types';
import { PublishingStage, PublishingStageStatus, PublishingGlobalStage } from '../store/publishing/types';
import { addStage } from '../utils/publishing-stage-generator';

export default class DotNetPublishingStrategy extends PublishingStrategyBase implements PublishingStrategy {
  private readonly baseSlnPath: string;
  private readonly nuGetApiKey: string;

  constructor(options: PublishingOptions) {
    super(options.packageSet, options.newVersion, options.onPublishingInfoChange);

    this.baseSlnPath = options.settings.baseSlnPath;
    this.nuGetApiKey = options.settings.nuGetApiKey;
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

  private async applyNewVersion(prevPublishingInfo: PublishingInfo): Promise<PublishingInfo> {
    let isVersionApplied = true;

    let publishingInfo: PublishingInfo = {
      ...prevPublishingInfo,
      stages: addStage(
        prevPublishingInfo.stages,
        PublishingStage.ApplyVersion,
        PublishingStageStatus.Executing,
        this.isOnePackage
      )
    }
    this.onPublishingInfoChange(publishingInfo);

    for (const project of this.packageSet.projectsInfo) {
      const assemblyAndFileVersion = getFileAndAssemblyVersion(this.newVersion);

      if (!assemblyAndFileVersion) {
        return await this.rejectLocalChanges(prevPublishingInfo, 'AssemblyAndFileVersion has not been found');
      }

      isVersionApplied = isVersionApplied && applyNewVersion(this.newVersion, assemblyAndFileVersion, this.baseSlnPath, project.name);
    }

    publishingInfo = {
      ...publishingInfo,
      stages: addStage(
        publishingInfo.stages,
        PublishingStage.ApplyVersion,
        isVersionApplied ? PublishingStageStatus.Finished : PublishingStageStatus.Failed,
        this.isOnePackage
      )
    }
    this.onPublishingInfoChange(publishingInfo);

    if (!isVersionApplied) {
      publishingInfo = await this.rejectLocalChanges(publishingInfo, 'The new versions are not applied');
    }

    return publishingInfo;
  }

  private async buildProject(prevPublishingInfo: PublishingInfo): Promise<PublishingInfo> {
    let publishingInfo: PublishingInfo = {
      ...prevPublishingInfo,
      stages: addStage(
        prevPublishingInfo.stages,
        PublishingStage.Build,
        PublishingStageStatus.Executing,
        this.isOnePackage
      )
    }
    this.onPublishingInfoChange(publishingInfo);

    let isBuildCompleted = true;
    for (const project of this.packageSet.projectsInfo) {
      isBuildCompleted = isBuildCompleted && await build(getProjectFilePath(this.baseSlnPath, project.name));
    }

    publishingInfo = {
      ...publishingInfo,
      stages: addStage(
        publishingInfo.stages,
        PublishingStage.Build,
        isBuildCompleted ? PublishingStageStatus.Finished : PublishingStageStatus.Failed,
        this.isOnePackage
      )
    }
    this.onPublishingInfoChange(publishingInfo);

    if (!isBuildCompleted) {
      publishingInfo = await this.rejectLocalChanges(publishingInfo, 'The project is not built. See a log file for details');
    }

    return publishingInfo;
  }

  private async pushPackage(prevPublishingInfo: PublishingInfo): Promise<PublishingInfo> {
    let publishingInfo: PublishingInfo = {
      ...prevPublishingInfo,
      stages: addStage(
        prevPublishingInfo.stages,
        PublishingStage.PublishPackage,
        PublishingStageStatus.Executing,
        this.isOnePackage
      )
    }
    this.onPublishingInfoChange(publishingInfo);

    let isPackagePublished = true;
    for (const project of this.packageSet.projectsInfo) {
      const nupkgFilePath = getNupkgFilePath(this.baseSlnPath, project.name, this.newVersion);
      isPackagePublished = isPackagePublished && await pushPackage(nupkgFilePath, this.nuGetApiKey);
    }

    publishingInfo = {
      ...publishingInfo,
      stages: addStage(
        publishingInfo.stages,
        PublishingStage.PublishPackage,
        isPackagePublished ? PublishingStageStatus.Finished : PublishingStageStatus.Failed,
        this.isOnePackage
      )
    }
    this.onPublishingInfoChange(publishingInfo);

    if (!isPackagePublished) {
      publishingInfo = await this.rejectLocalChanges(publishingInfo, 'The package is not published. Check an API key and connection. See a log file for details');
    }

    return publishingInfo;
  }

  async rejectPublishing(prevPublishingInfo: PublishingInfo): Promise<void> {
    let publishingInfo: PublishingInfo = {
      ...prevPublishingInfo,
      globalStage: PublishingGlobalStage.Rejecting,
      stages: addStage(
        prevPublishingInfo.stages,
        PublishingStage.Reject,
        PublishingStageStatus.Executing,
        this.isOnePackage
      )
    }
    this.onPublishingInfoChange(publishingInfo);

    for (const project of this.packageSet.projectsInfo) {
      await deletePackage(project.name, this.newVersion, this.nuGetApiKey);
    }

    await this.removeLastCommitAndTags(publishingInfo);
    publishingInfo = {
      ...publishingInfo,
      globalStage: PublishingGlobalStage.Rejected,
      stages: addStage(
        publishingInfo.stages,
        PublishingStage.Reject,
        PublishingStageStatus.Finished,
        this.isOnePackage
      )
    }
    this.onPublishingInfoChange(publishingInfo);
  }
}
