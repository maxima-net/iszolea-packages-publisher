import Redux from 'redux';
import { Settings, UpdateStatus, PublishingInfo } from '../reducers/types';

interface BaseAction extends Redux.Action<string> {
  payload?: any;
}

export type AnyAction = ApplySettingsAction | CancelSettingsAction | RejectSettingsAction | SwitchSettingsViewAction
  | ChangeUpdateStatusAction | InitializePublishingAction | UpdateGitStatusAction | ApplyProjectAction
  | ApplyVersionProviderAction | ApplyNewVersionAction | UpdatePublishingInfoAction;

export interface ApplySettingsAction extends BaseAction {
  type: 'APPLY_SETTINGS';
  payload: {
    settings: Settings;
    displaySettingsView: boolean;
  }
}

export interface CancelSettingsAction extends BaseAction {
  type: 'CANCEL_SETTINGS';
}

export interface RejectSettingsAction extends BaseAction {
  type: 'REJECT_SETTINGS';
  payload: Settings;
}

export interface SwitchSettingsViewAction extends BaseAction {
  type: 'SWITCH_SETTINGS_VIEW';
  payload: boolean;
}

export interface ChangeUpdateStatusAction extends BaseAction {
  type: 'CHANGE_UPDATE_STATUS';
  payload: UpdateStatus;
}

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
