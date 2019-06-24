import PublishingStep from './publishing-step';
import { PublishingInfo } from '../../store/types';
import { PublishingStage, PublishingStageStatus } from '../../store/publishing/types';
import * as Git from '../../utils/git';
import PackageSet from '../../packages/package-set';
import VersionTagGenerator from '../version-tag-generators/version-tag-generator';

export default class CreateCommitWithTagsStep extends PublishingStep {
  private readonly newVersion: string;

  constructor(packageSet: PackageSet, publishingInfo: PublishingInfo, onPublishingInfoChange: (publishingInfo: PublishingInfo) => void,
    versionTagGenerator: VersionTagGenerator, newVersion: string) {
    super(packageSet, publishingInfo, onPublishingInfoChange, versionTagGenerator);
    this.newVersion = newVersion;
  }

  async execute(): Promise<PublishingInfo> {
    let publishingInfo: PublishingInfo = {
      ...this.publishingInfo,
      stages: this.stageGenerator.addStage(
        this.publishingInfo.stages,
        PublishingStage.GitCommit,
        PublishingStageStatus.Executing,
      )
    };
    this.onPublishingInfoChange(publishingInfo);

    for (const project of this.packageSet.projectsInfo) {
      await Git.stageFiles(project.dir);
    }
    const projectDirPath = this.packageSet.projectsInfo[0].dir;
    const tags = this.versionTagGenerator.getVersionTags(this.packageSet, this.newVersion);
    const isCommitMade = await Git.createCommitWithTags(projectDirPath, tags);

    publishingInfo = {
      ...publishingInfo,
      stages: this.stageGenerator.addStage(
        publishingInfo.stages,
        PublishingStage.GitCommit,
        isCommitMade ? PublishingStageStatus.Finished : PublishingStageStatus.Failed,
      )
    };
    this.onPublishingInfoChange(publishingInfo);

    if (!isCommitMade) {
      publishingInfo = await this.rejectLocalChanges(publishingInfo, 'The result commit is not created');
    }

    return publishingInfo;
  }
}
