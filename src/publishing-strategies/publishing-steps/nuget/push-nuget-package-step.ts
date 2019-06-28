import PublishingStep from '../publishing-step';
import { PublishingInfo } from '../../../store/types';
import { PublishingStage, PublishingStageStatus } from '../../../store/publishing/types';
import { getNupkgFilePath } from '../../../utils/path';
import { pushPackage } from '../../../utils/nuget';
import PackageSet from '../../../packages/package-set';
import VersionTagGenerator from '../../version-tag-generators/version-tag-generator';

export default class PushNugetPackageStep extends PublishingStep {
  private readonly newVersion: string;
  private readonly nuGetApiKey: string;

  constructor(packageSet: PackageSet, onPublishingInfoChange: (publishingInfo: PublishingInfo) => void,
  versionTagGenerator: VersionTagGenerator, newVersion: string, nuGetApiKey: string)
  {
    super(packageSet, onPublishingInfoChange, versionTagGenerator);
    this.newVersion = newVersion;
    this.nuGetApiKey = nuGetApiKey;
  }
  
  async execute(publishingInfo: PublishingInfo): Promise<PublishingInfo> {
    publishingInfo = {
      ...publishingInfo,
      stages: this.stageGenerator.addStage(
        publishingInfo.stages,
        PublishingStage.PublishPackage,
        PublishingStageStatus.Executing,
      )
    }
    this.onPublishingInfoChange(publishingInfo);

    let isPackagePublished = true;
    for (const project of this.packageSet.projectsInfo) {
      const nupkgFilePath = getNupkgFilePath(this.packageSet.baseFolderPath, project.name, this.newVersion);
      isPackagePublished = isPackagePublished && await pushPackage(nupkgFilePath, this.nuGetApiKey);
    }

    publishingInfo = {
      ...publishingInfo,
      stages: this.stageGenerator.addStage(
        publishingInfo.stages,
        PublishingStage.PublishPackage,
        isPackagePublished ? PublishingStageStatus.Finished : PublishingStageStatus.Failed,
      )
    }
    this.onPublishingInfoChange(publishingInfo);

    if (!isPackagePublished) {
      publishingInfo = await this.rejectLocalChanges(publishingInfo, 'The package is not published. Check an API key and connection. See a log file for details');
    }

    return publishingInfo;
  }
}
