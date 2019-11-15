import PublishingStep from './publishing-step';
import { PublishingInfo } from '../../store/types';
import { PublishingStage, PublishingStageStatus } from '../../store/publishing/types';
import PackageSet from '../../packages/package-set';
import VersionTagGenerator from '../version-tag-generators/version-tag-generator';
import { GitService } from '../../utils/git-service';

export default class CreateCommitWithTagsStep extends PublishingStep {
  private readonly newVersion: string;

  constructor(packageSet: PackageSet, onPublishingInfoChange: (publishingInfo: PublishingInfo) => void,
    versionTagGenerator: VersionTagGenerator, newVersion: string) {
    super(packageSet, onPublishingInfoChange, versionTagGenerator);
    this.newVersion = newVersion;
  }

  async execute(publishingInfo: PublishingInfo): Promise<PublishingInfo> {
    publishingInfo = {
      ...publishingInfo,
      stages: this.stageGenerator.addStage(
        publishingInfo.stages,
        PublishingStage.GitCommit,
        PublishingStageStatus.Executing,
      )
    };
    this.onPublishingInfoChange(publishingInfo);

    const projectDirPath = this.packageSet.projectsInfo[0].dir;
    const git = new GitService(projectDirPath);

    await git.stageFiles();
    const tags = this.versionTagGenerator.getVersionTags(this.packageSet, this.newVersion);
    const isCommitMade = await git.createCommitWithTags(tags);

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
