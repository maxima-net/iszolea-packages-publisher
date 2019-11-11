import { BaseAction, UpdateStatus } from '../types';
import { UpdateInfo } from 'electron-updater';

export interface SwitchSettingsViewAction extends BaseAction {
  type: 'SWITCH_SETTINGS_VIEW';
  payload: boolean;
}

export interface ChangeUpdateStatusAction extends BaseAction {
  type: 'CHANGE_UPDATE_STATUS';
  payload: {
    updateStatus: UpdateStatus;
    updateInfo: UpdateInfo | undefined;
  };
}

export type LayoutAction = SwitchSettingsViewAction | ChangeUpdateStatusAction;
