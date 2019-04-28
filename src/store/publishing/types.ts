import { BaseAction, PublishingInfo } from '../types';

export interface InitializePublishingAction extends BaseAction {
  type: 'INITIALIZE_PUBLISHING';
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
