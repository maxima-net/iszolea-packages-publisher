import { PublishingInfo } from '../../store/types';
import { PublishingStageGenerator } from '../../utils/publishing-stage-generator';
import PackageSet from '../../packages/package-set';
import { PublishingGlobalStage, PublishingStage, PublishingStageStatus } from '../../store/publishing/types';
import * as Git from '../../utils/git';
import VersionTagGenerator from '../version-tag-generators/version-tag-generator';

export default abstract class PublishingStep {
  protected readonly packageSet: PackageSet;
  protected readonly stageGenerator: PublishingStageGenerator;
  protected readonly onPublishingInfoChange: (publishingInfo: PublishingInfo) => void;
  protected readonly versionTagGenerator: VersionTagGenerator;

  constructor(packageSet: PackageSet, onPublishingInfoChange: (publishingInfo: PublishingInfo) => void,
    versionTagGenerator: VersionTagGenerator)
  {
    this.packageSet = packageSet;
    this.stageGenerator = new PublishingStageGenerator(packageSet.isOnePackage);
    this.onPublishingInfoChange = onPublishingInfoChange;
    this.versionTagGenerator = versionTagGenerator;
  }

  abstract execute(publishingInfo: PublishingInfo): Promise<PublishingInfo>;

  protected async rejectLocalChanges(prevPublishingInfo: PublishingInfo, error: string): Promise<PublishingInfo> {
    let publishingInfo: PublishingInfo = {
      ...prevPublishingInfo,
      error,
      globalStage: PublishingGlobalStage.Rejecting,
      stages: this.stageGenerator.addStage(
        prevPublishingInfo.stages,
        PublishingStage.Reject,
        PublishingStageStatus.Executing,
      )
    };
    this.onPublishingInfoChange(publishingInfo);

    const areChangesRejected = await Git.resetChanges(this.packageSet.projectsInfo[0].dir);

    publishingInfo = {
      ...publishingInfo,
      globalStage: PublishingGlobalStage.Rejected,
      stages: this.stageGenerator.addStage(
        publishingInfo.stages,
        PublishingStage.Reject,
        areChangesRejected ? PublishingStageStatus.Finished : PublishingStageStatus.Failed,
      )
    };
    this.onPublishingInfoChange(publishingInfo);

    return publishingInfo;
  }

  protected async removeLastCommitAndTags(newVersion: string): Promise<void> {
    const projectDirPath = this.packageSet.projectsInfo[0].dir;
    const tags = this.versionTagGenerator.getVersionTags(this.packageSet, newVersion);
    await Git.removeLastCommitAndTags(projectDirPath, tags);
  }
}
