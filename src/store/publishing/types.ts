import { BaseAction, PublishingInfo } from '../types';
import PackageSet from '../../packages/package-set';

export interface InitializePublishingAction extends BaseAction {
  type: 'INITIALIZE_PUBLISHING';
  payload: PackageSet[];
}

export interface UpdateGitInfoAction extends BaseAction {
  type: 'UPDATE_GIT_INFO';
  payload: {
    isCommitted: boolean;
    branchName: string | undefined;
  };
}

export interface ApplyProjectAction extends BaseAction {
  type: 'APPLY_PROJECT';
  payload: {
    packageSet: PackageSet | undefined;
    newVersion: string;
    newVersionError: string | undefined;
    versionProviderName: string;
    isEverythingCommitted: boolean | undefined;
  };
}

export interface ApplyVersionProviderAction extends BaseAction {
  type: 'APPLY_VERSION_PROVIDER';
  payload: {
    versionProviderName: string;
    newVersion: string;
    newVersionError: string | undefined;
  };
}

export interface ApplyNewVersionAction extends BaseAction {
  type: 'APPLY_NEW_VERSION';
  payload: {
    newVersion: string;
    newVersionError: string | undefined;
  };
}

export interface UpdatePublishingInfoAction extends BaseAction {
  type: 'UPDATE_PUBLISHING_INFO';
  payload: PublishingInfo | undefined;
}

export interface PublishingStageInfo {
  text: string;
  status: PublishingStageStatus;
}

export enum PublishingStageStatus {
  Executing,
  Finished,
  Failed
} 

export enum PublishingStage {
  CheckGitRepository,
  ApplyVersion,
  Build,
  PublishPackage,
  GitCommit,
  GitPush,
  Reject
} 

export enum PublishingGlobalStage {
  Publishing,
  Published,
  Pushing,
  Pushed,
  Rejecting,
  Rejected
}

export type PublishingAction = InitializePublishingAction | UpdateGitInfoAction | ApplyProjectAction
  | ApplyVersionProviderAction | ApplyNewVersionAction | UpdatePublishingInfoAction;
