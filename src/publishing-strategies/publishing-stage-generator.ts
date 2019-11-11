import { PublishingStageInfo, PublishingStage, PublishingStageStatus } from '../store/publishing/types';

export class PublishingStageGenerator {
  private readonly isOnePackage: boolean;

  constructor(isOnePackage: boolean) {
    this.isOnePackage = isOnePackage;
  }

  addStage(
    map: ReadonlyMap<PublishingStage, PublishingStageInfo>, key: PublishingStage, status: PublishingStageStatus,
  ): Map<PublishingStage, PublishingStageInfo> {
    return new Map(map).set(key, this.generate(key, status));
  }

  private generate(key: PublishingStage, status: PublishingStageStatus): PublishingStageInfo {
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
        };

      case PublishingStage.Build:
        return {
          text: status === PublishingStageStatus.Executing
            ? `The project${this.isOnePackage ? ' is' : 's are'} being built`
            : `The project${this.isOnePackage ? ' has' : 's have'}${status === PublishingStageStatus.Finished ? '' : ' not'} been built`,
          status
        };

      case PublishingStage.PublishPackage:
        return {
          text: status === PublishingStageStatus.Executing
            ? `The package${this.isOnePackage ? ' is' : 's are'} being published`
            : `The package${this.isOnePackage ? ' has' : 's have'}${status === PublishingStageStatus.Finished ? '' : ' not'} been published`,
          status
        };

      case PublishingStage.GitCommit:
        return {
          text: status === PublishingStageStatus.Executing
            ? 'The changes are being committed'
            : `The changes have${status === PublishingStageStatus.Finished ? '' : ' not'} been committed with version tag${this.isOnePackage ? '' : 's'}`,
          status
        };

        case PublishingStage.GitPush:
          return {
            text: status === PublishingStageStatus.Executing
              ? 'The commit is being pushed with tags'
              : `The commit has${status === PublishingStageStatus.Finished ? '' : ' not'} been pushed with tags`,
            status
          };

      case PublishingStage.Reject:
        return {
          text: status === PublishingStageStatus.Executing
            ? 'The operations are being rejected'
            : `The operations have${status === PublishingStageStatus.Finished ? '' : ' not'} been rejected`,
          status
        };
    }
  }
}
