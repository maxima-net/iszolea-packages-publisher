import PublishingStep from './publishing-step';
import { PublishingInfo } from '../../store/types';
import { PublishingStage, PublishingStageStatus } from '../../store/publishing/types';
import VersionTagGenerator from '../version-tag-generators/version-tag-generator';
import PackageSet from '../../packages/package-set';

export default class CheckVersionUniquenessStep extends PublishingStep {
  private readonly newVersion: string;

  constructor(
    packageSet: PackageSet,
    onPublishingInfoChange: (publishingInfo: PublishingInfo) => void,
    versionTagGenerator: VersionTagGenerator,
    newVersion: string,
  ) {
    super(packageSet, onPublishingInfoChange, versionTagGenerator);
    this.newVersion = newVersion;
  }

  async execute(publishingInfo: PublishingInfo): Promise<PublishingInfo> {
    publishingInfo = {
      ...publishingInfo,
      stages: this.stageGenerator.addStage(
        publishingInfo.stages,
        PublishingStage.CheckVersionUniqueness,
        PublishingStageStatus.Executing
      )
    };
    this.onPublishingInfoChange(publishingInfo);

    const publishedVersions = await this.packageSet.getPublishedVersions();
    const isVersionUnique = publishedVersions.every((v)=> v.rawVersion !== this.newVersion);

    publishingInfo = {
      ...publishingInfo,
      stages: this.stageGenerator.addStage(
        publishingInfo.stages,
        PublishingStage.CheckVersionUniqueness,
        isVersionUnique ? PublishingStageStatus.Finished : PublishingStageStatus.Failed,
      )
    };
    this.onPublishingInfoChange(publishingInfo);

    if (!isVersionUnique) {
      publishingInfo = await this.rejectLocalChanges(publishingInfo, 'This version has already been published');
    }

    return publishingInfo;
  }
}
