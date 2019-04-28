import { SwitchSettingsViewAction, ChangeUpdateStatusAction } from './types';
import { UpdateStatus } from '../types';

export const changeUpdateStatus = (updateStatus: UpdateStatus): ChangeUpdateStatusAction => {
  return { type: 'CHANGE_UPDATE_STATUS', payload: updateStatus }
}

export const switchSettingsView = (display: boolean): SwitchSettingsViewAction => {
  return { type: 'SWITCH_SETTINGS_VIEW', payload: display }
}
