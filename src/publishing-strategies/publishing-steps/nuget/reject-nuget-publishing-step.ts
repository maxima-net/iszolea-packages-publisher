import PublishingStep from '../publishing-step';
import { PublishingInfo } from '../../../store/types';
import { PublishingGlobalStage, PublishingStage, PublishingStageStatus } from '../../../store/publishing/types';
import { deletePackage } from '../../../utils/nuget';
import PackageSet from '../../../packages/package-set';
import VersionTagGenerator from '../../version-tag-generators/version-tag-generator';

export default class RejectNugetPublishingStep extends PublishingStep {
  private readonly newVersion: string;
  private readonly nuGetApiKey: string;

  constructor(packageSet: PackageSet, onPublishingInfoChange: (publishingInfo: PublishingInfo) => void,
    versionTagGenerator: VersionTagGenerator, newVersion: string, nuGetApiKey: string) {
    super(packageSet, onPublishingInfoChange, versionTagGenerator);
    this.newVersion = newVersion;
    this.nuGetApiKey = nuGetApiKey;
  }

  async execute(publishingInfo: PublishingInfo): Promise<PublishingInfo> {
    publishingInfo = {
      ...publishingInfo,
      globalStage: PublishingGlobalStage.Rejecting,
      stages: this.stageGenerator.addStage(
        publishingInfo.stages,
        PublishingStage.Reject,
        PublishingStageStatus.Executing,
      )
    }
    this.onPublishingInfoChange(publishingInfo);

    for (const project of this.packageSet.projectsInfo) {
      await deletePackage(project.name, this.newVersion, this.nuGetApiKey);
    }

    await this.removeLastCommitAndTags(this.newVersion);
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

    return publishingInfo;
  }
}
