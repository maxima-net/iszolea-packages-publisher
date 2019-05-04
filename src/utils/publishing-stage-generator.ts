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
            ? 'The git repository is being checked'
            : `The git repository has${status === PublishingStageStatus.Finished ? '' : ' not'} been checked`,
          status
        };

      case PublishingStage.ApplyVersion:
        return {
          text: status === PublishingStageStatus.Executing
            ? 'The new version is being applied'
            : `The new version has${status === PublishingStageStatus.Finished ? '' : ' not'} been applied`,
          status
        }

      case PublishingStage.Build:
        return {
          text: status === PublishingStageStatus.Executing
            ? `The project${isOnePackage ? ' is' : 's are'} being built`
            : `The project${isOnePackage ? ' has' : 's have'}${status === PublishingStageStatus.Finished ? '' : ' not'} been built`,
          status
        }

      case PublishingStage.PublishPackage:
        return {
          text: status === PublishingStageStatus.Executing
            ? `The package${isOnePackage ? ' is' : 's are'} being published`
            : `The package${isOnePackage ? ' has' : 's have'}${status === PublishingStageStatus.Finished ? '' : ' not'} been published`,
          status
        }

      case PublishingStage.GitCommit:
        return {
          text: status === PublishingStageStatus.Executing
            ? `The changes are being committed`
            : `The changes have${status === PublishingStageStatus.Finished ? '' : ' not'} been committed with version tag${isOnePackage ? '' : 's'}`,
          status
        }

      case PublishingStage.Reject:
        return {
          text: status === PublishingStageStatus.Executing
            ? `The operations are being rejected`
            : `The operations have${status === PublishingStageStatus.Finished ? '' : ' not'} been rejected`,
          status
        }
    }
  }
}
