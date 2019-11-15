import PublishingStep from './publishing-step';
import { PublishingInfo } from '../../store/types';
import { PublishingStage, PublishingStageStatus } from '../../store/publishing/types';
import { GitService } from '../../utils/git-service';

export default class CheckIsCommittedStep extends PublishingStep {
  async execute(publishingInfo: PublishingInfo): Promise<PublishingInfo> {
    publishingInfo = {
      ...publishingInfo,
      stages: this.stageGenerator.addStage(
        publishingInfo.stages,
        PublishingStage.CheckGitRepository,
        PublishingStageStatus.Executing
      )
    };
    this.onPublishingInfoChange(publishingInfo);

    const gitService = new GitService(this.packageSet.projectsInfo[0].dir);

    const isEverythingCommitted = await gitService.isEverythingCommitted();
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
