import PublishingStep from '../publishing-step';
import { PublishingInfo } from '../../../store/types';
import { PublishingStageStatus, PublishingStage } from '../../../store/publishing/types';
import { Constants } from '../../../utils/path';
import { applyNewVersion } from '../../../utils/npm-package';
import PackageSet from '../../../packages/package-set';
import VersionTagGenerator from '../../version-tag-generators/version-tag-generator';

export default class ApplyNewNpmVersionStep extends PublishingStep {
  private readonly newVersion: string;

  constructor(packageSet: PackageSet, onPublishingInfoChange: (publishingInfo: PublishingInfo) => void,
    versionTagGenerator: VersionTagGenerator, newVersion: string) {
    super(packageSet, onPublishingInfoChange, versionTagGenerator);
    this.newVersion = newVersion;
  }
  
  async execute(publishingInfo: PublishingInfo): Promise<PublishingInfo> {
    let isVersionApplied = true;

    publishingInfo = {
      ...publishingInfo,
      stages: this.stageGenerator.addStage(
        publishingInfo.stages,
        PublishingStage.ApplyVersion,
        PublishingStageStatus.Executing,
      )
    };

    for (const project of this.packageSet.projectsInfo) {
      if (project.name === Constants.IszoleaUIPackageName) {
        isVersionApplied = isVersionApplied && applyNewVersion(this.newVersion, this.packageSet.baseFolderPath);
      } else {
        isVersionApplied = false;
      }
    }

    publishingInfo = {
      ...publishingInfo,
      stages: this.stageGenerator.addStage(
        publishingInfo.stages,
        PublishingStage.ApplyVersion,
        isVersionApplied ? PublishingStageStatus.Finished : PublishingStageStatus.Failed,
      )
    }
    this.onPublishingInfoChange(publishingInfo);

    if (!isVersionApplied) {
      publishingInfo = await this.rejectLocalChanges(publishingInfo, 'The new versions are not applied');
    }

    return publishingInfo;
  }
}
