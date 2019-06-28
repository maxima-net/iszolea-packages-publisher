import PublishingStep from '../publishing-step';
import { PublishingInfo } from '../../../store/types';
import { PublishingStage, PublishingStageStatus } from '../../../store/publishing/types';
import { getProjectFilePath } from '../../../utils/path';
import { build } from '../../../utils/dotnet-project';

export default class BuildDotnetProjectStep extends PublishingStep {
  async execute(publishingInfo: PublishingInfo): Promise<PublishingInfo> {
    publishingInfo = {
      ...publishingInfo,
      stages: this.stageGenerator.addStage(
        publishingInfo.stages,
        PublishingStage.Build,
        PublishingStageStatus.Executing,
      )
    }
    this.onPublishingInfoChange(publishingInfo);

    let isBuildCompleted = true;
    for (const project of this.packageSet.projectsInfo) {
      isBuildCompleted = isBuildCompleted && await build(getProjectFilePath(this.packageSet.baseFolderPath, project.name));
    }

    publishingInfo = {
      ...publishingInfo,
      stages: this.stageGenerator.addStage(
        publishingInfo.stages,
        PublishingStage.Build,
        isBuildCompleted ? PublishingStageStatus.Finished : PublishingStageStatus.Failed,
      )
    }
    this.onPublishingInfoChange(publishingInfo);

    if (!isBuildCompleted) {
      publishingInfo = await this.rejectLocalChanges(publishingInfo, 'The project is not built. See a log file for details');
    }

    return publishingInfo;
  }
} 
