import PublishingStep from '../publishing-step';
import { PublishingInfo } from '../../../store/types';
import { PublishingGlobalStage, PublishingStageStatus, PublishingStage } from '../../../store/publishing/types';
import PackageSet from '../../../packages/package-set';
import VersionTagGenerator from '../../version-tag-generators/version-tag-generator';
import NpmProject from '../../../utils/npm-project';

export default class RejectNpmPublishingStep extends PublishingStep {
  private readonly newVersion: string;

  constructor(packageSet: PackageSet, onPublishingInfoChange: (publishingInfo: PublishingInfo) => void,
    versionTagGenerator: VersionTagGenerator, newVersion: string)
  {
    super(packageSet, onPublishingInfoChange, versionTagGenerator);
    this.newVersion = newVersion;
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
    };
    this.onPublishingInfoChange(publishingInfo);

    for (const project of this.packageSet.projectsInfo) {
      const npmProject = new NpmProject(this.packageSet.baseFolderPath);
      // eslint-disable-next-line no-await-in-loop
      await npmProject.unPublishPackage(project.name, this.newVersion);
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
    };
    this.onPublishingInfoChange(publishingInfo);

    return publishingInfo;
  }
}
