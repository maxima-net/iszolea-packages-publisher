import PublishingStep from '../publishing-step';
import { PublishingInfo } from '../../../store/types';
import { PublishingStage, PublishingStageStatus } from '../../../store/publishing/types';
import PackageSet from '../../../packages/package-set';
import { applyNewVersion } from '../../../utils/dotnet-project';
import VersionTagGenerator from '../../version-tag-generators/version-tag-generator';
import VersionConvertor from '../../../version/version-converter';

export default class ApplyNewNugetVersionStep extends PublishingStep {
  private readonly newVersion: string;
  private readonly versionConvertor: VersionConvertor;

  constructor(
    packageSet: PackageSet,
    onPublishingInfoChange: (publishingInfo: PublishingInfo) => void,
    versionTagGenerator: VersionTagGenerator,
    newVersion: string,
    versionConvertor: VersionConvertor
  ) {
    super(packageSet, onPublishingInfoChange, versionTagGenerator);
    this.newVersion = newVersion;
    this.versionConvertor = versionConvertor;
  }

  async execute(publishingInfo: PublishingInfo): Promise<PublishingInfo> {
    let isVersionApplied = true;

    publishingInfo = {
      ...publishingInfo,
      stages: this.stageGenerator.addStage(
        publishingInfo.stages,
        PublishingStage.ApplyVersion,
        PublishingStageStatus.Executing,
      )
    }
    this.onPublishingInfoChange(publishingInfo);

    for (const project of this.packageSet.projectsInfo) {
      const assemblyAndFileVersion = this.versionConvertor.convertToAssemblyVersion(this.newVersion);

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
