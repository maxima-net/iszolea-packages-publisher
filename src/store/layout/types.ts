import { BaseAction, UpdateStatus } from '../types';

export interface SwitchSettingsViewAction extends BaseAction {
  type: 'SWITCH_SETTINGS_VIEW';
  payload: boolean;
}

export interface ChangeUpdateStatusAction extends BaseAction {
  type: 'CHANGE_UPDATE_STATUS';
  payload: UpdateStatus;
}
