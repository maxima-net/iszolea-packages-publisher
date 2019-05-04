import { PublishingStageInfo, PublishingStage, PublishingStageStatus } from '../store/publishing/types';

export class PublishingStageGenerator {
  public static addStage(
    map: ReadonlyMap<PublishingStage, PublishingStageInfo>,
    key: PublishingStage,
    status: PublishingStageStatus,
    isOnePackage: boolean
  ): Map<PublishingStage, PublishingStageInfo> {
    return new Map(map).set(key, this.generate(key, status, isOnePackage));
  }

  private static generate(key: PublishingStage, status: PublishingStageStatus, isOnePackage: boolean): PublishingStageInfo {
    switch (key) {
      case PublishingStage.CheckGitRepository:
        return {
          text: status === PublishingStageStatus.Executing
            ? 'The git repository is checking'
            : `The git repository is${status === PublishingStageStatus.Finished ? '' : ' not'} checked`,
          status
        };

      case PublishingStage.ApplyVersion:
        return {
          text: status === PublishingStageStatus.Executing
            ? 'The new version is being applying'
            : `The new version is${status === PublishingStageStatus.Finished ? '' : ' not'} applied`,
          status
        }

      case PublishingStage.Build:
        return {
          text: status === PublishingStageStatus.Executing
            ? `The project${isOnePackage ? ' is' : 's are'} being building`
            : `The project${isOnePackage ? ' is' : 's are'}${status === PublishingStageStatus.Finished ? '' : ' not'} built`,
          status
        }

      case PublishingStage.PublishPackage:
        return {
          text: status === PublishingStageStatus.Executing
            ? `The package${isOnePackage ? ' is' : 's are'} being publishing`
            : `The package${isOnePackage ? ' is' : 's are'}${status === PublishingStageStatus.Finished ? '' : ' not'} published`,
          status
        }

      case PublishingStage.GitCommit:
        return {
          text: status === PublishingStageStatus.Executing
            ? `The changes are being committing`
            : `The changes are${status === PublishingStageStatus.Finished ? '' : ' not'} committed with version tag${isOnePackage ? '' : 's'}`,
          status
        }

      case PublishingStage.Reject:
        return {
          text: status === PublishingStageStatus.Executing
            ? `The operations are being rejecting`
            : `The operations are${status === PublishingStageStatus.Finished ? '' : ' not'} rejected`,
          status
        }
    }
  }
}
