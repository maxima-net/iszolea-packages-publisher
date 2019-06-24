import PublishingStep from './publishing-step';
import { PublishingInfo } from '../../store/types';
import { PublishingStage, PublishingStageStatus } from '../../store/publishing/types';
import * as Git from '../../utils/git';

export default class CheckIsCommittedStep extends PublishingStep {
  async execute(): Promise<PublishingInfo> {
    let publishingInfo: PublishingInfo = {
      ...this.publishingInfo,
      stages: this.stageGenerator.addStage(
        this.publishingInfo.stages,
        PublishingStage.CheckGitRepository,
        PublishingStageStatus.Executing
      )
    };
    this.onPublishingInfoChange(publishingInfo);

    const isEverythingCommitted = await Git.isEverythingCommitted(this.packageSet.projectsInfo[0].dir);
    publishingInfo = {
      ...publishingInfo,
      stages: this.stageGenerator.addStage(
        publishingInfo.stages,
        PublishingStage.CheckGitRepository,
        isEverythingCommitted ? PublishingStageStatus.Finished : PublishingStageStatus.Failed,
      )
    };
    this.onPublishingInfoChange(publishingInfo);

    if (!isEverythingCommitted) {
      publishingInfo = await this.rejectLocalChanges(publishingInfo, 'The git repository has unsaved changes. Commit or remove them');
    }

    return publishingInfo;
  }
}
