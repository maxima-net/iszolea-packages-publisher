import PublishingStep from '../publishing-step';
import { PublishingInfo } from '../../../store/types';
import { PublishingGlobalStage, PublishingStageStatus, PublishingStage } from '../../../store/publishing/types';
import { unPublishPackage } from '../../../utils/npm-package';
import PackageSet from '../../../packages/package-set';
import VersionTagGenerator from '../../version-tag-generators/version-tag-generator';

export default class RejectNpmPublishingStep extends PublishingStep {
  private readonly newVersion: string;

  constructor(packageSet: PackageSet, publishingInfo: PublishingInfo, onPublishingInfoChange: (publishingInfo: PublishingInfo) => void,
    versionTagGenerator: VersionTagGenerator, newVersion: string)
  {
    super(packageSet, publishingInfo, onPublishingInfoChange, versionTagGenerator);
    this.newVersion = newVersion;
  }
  
  async execute(): Promise<PublishingInfo> {
    let publishingInfo: PublishingInfo = {
      ...this.publishingInfo,
      globalStage: PublishingGlobalStage.Rejecting,
      stages: this.stageGenerator.addStage(
        this.publishingInfo.stages,
        PublishingStage.Reject,
        PublishingStageStatus.Executing,
      )
    }
    this.onPublishingInfoChange(publishingInfo);

    for (const project of this.packageSet.projectsInfo) {
      await unPublishPackage(project.name, this.newVersion);
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
