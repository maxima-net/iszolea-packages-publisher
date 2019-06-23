import { BaseAction, PublishingInfo } from '../types';
import PackageSet from '../../packages/package-set';

export interface InitializePublishingAction extends BaseAction {
  type: 'INITIALIZE_PUBLISHING';
  payload: PackageSet[];
}

export interface UpdateGitStatusAction extends BaseAction {
  type: 'UPDATE_GIT_STATUS';
  payload: boolean;
}

export interface ApplyProjectAction extends BaseAction {
  type: 'APPLY_PROJECT';
  payload: {
    packageSetId: number;
    newVersion: string;
    versionProviderName: string;
    isCustomVersionSelection: boolean;
    isEverythingCommitted: boolean | undefined;
  }
}

export interface ApplyVersionProviderAction extends BaseAction {
  type: 'APPLY_VERSION_PROVIDER';
  payload: {
    versionProviderName: string;
    newVersion: string;
    isCustomVersionSelection: boolean;
  }
}

export interface ApplyNewVersionAction extends BaseAction {
  type: 'APPLY_NEW_VERSION';
  payload: string;
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
  Reject
} 

export enum PublishingGlobalStage {
  Publishing,
  Published,
  Rejecting,
  Rejected
}

export type PublishingAction = InitializePublishingAction | UpdateGitStatusAction | ApplyProjectAction
  | ApplyVersionProviderAction | ApplyNewVersionAction | UpdatePublishingInfoAction;
