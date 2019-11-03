import PublishingStep from './publishing-step';
import { PublishingInfo } from '../../store/types';
import { PublishingStage, PublishingStageStatus } from '../../store/publishing/types';
import * as Git from '../../utils/git';

export default class PushWithTagsStep extends PublishingStep {
  public async execute(publishingInfo: PublishingInfo): Promise<PublishingInfo> {
    publishingInfo = {
      ...publishingInfo,
      stages: this.stageGenerator.addStage(
        publishingInfo.stages,
        PublishingStage.GitPush,
        PublishingStageStatus.Executing,
      )
    };
    this.onPublishingInfoChange(publishingInfo);

    const projectDirPath = this.packageSet.projectsInfo[0].dir;
    const isPushed = await Git.pushWithTags(projectDirPath);

    publishingInfo = {
      ...publishingInfo,
      stages: this.stageGenerator.addStage(
        publishingInfo.stages,
        PublishingStage.GitPush,
        isPushed ? PublishingStageStatus.Finished : PublishingStageStatus.Failed,
      )
    };
    this.onPublishingInfoChange(publishingInfo);

    return publishingInfo;
  }
}
