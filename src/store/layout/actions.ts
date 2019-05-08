import { SwitchSettingsViewAction, ChangeUpdateStatusAction } from './types';
import { UpdateStatus } from '../types';
import { UpdateInfo } from 'electron-updater';

export const changeUpdateStatus = (updateStatus: UpdateStatus, updateInfo?: UpdateInfo): ChangeUpdateStatusAction => {
  return { type: 'CHANGE_UPDATE_STATUS', payload: { updateStatus, updateInfo } };
}

export const switchSettingsView = (display: boolean): SwitchSettingsViewAction => {
  return { type: 'SWITCH_SETTINGS_VIEW', payload: display };
}
