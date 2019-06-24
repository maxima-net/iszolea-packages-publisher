import PublishingStep from '../publishing-step';
import { PublishingInfo } from '../../../store/types';
import { PublishingStage, PublishingStageStatus } from '../../../store/publishing/types';
import { getFileAndAssemblyVersion } from '../../../utils/version';
import PackageSet from '../../../packages/package-set';
import { applyNewVersion } from '../../../utils/dotnet-project';
import VersionTagGenerator from '../../version-tag-generators/version-tag-generator';

export default class ApplyNewNugetVersionStep extends PublishingStep {
  private readonly newVersion: string;

  constructor(packageSet: PackageSet, publishingInfo: PublishingInfo, onPublishingInfoChange: (publishingInfo: PublishingInfo) => void,
    versionTagGenerator: VersionTagGenerator, newVersion: string)
  {
    super(packageSet, publishingInfo, onPublishingInfoChange, versionTagGenerator);
    this.newVersion = newVersion;
  }
  
  async execute(): Promise<PublishingInfo> {
    let isVersionApplied = true;

    let publishingInfo: PublishingInfo = {
      ...this.publishingInfo,
      stages: this.stageGenerator.addStage(
        this.publishingInfo.stages,
        PublishingStage.ApplyVersion,
        PublishingStageStatus.Executing,
      )
    }
    this.onPublishingInfoChange(publishingInfo);

    for (const project of this.packageSet.projectsInfo) {
      const assemblyAndFileVersion = getFileAndAssemblyVersion(this.newVersion);

      if (!assemblyAndFileVersion) {
        return await this.rejectLocalChanges(publishingInfo, 'AssemblyAndFileVersion has not been found');
      }

      isVersionApplied = isVersionApplied && applyNewVersion(this.newVersion, assemblyAndFileVersion, this.packageSet.baseFolderPath, project.name);
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
}
