import { SwitchSettingsViewAction, ChangeUpdateStatusAction } from './types';
import { UpdateStatus } from '../types';

export function changeUpdateStatus(updateStatus: UpdateStatus): ChangeUpdateStatusAction {
  return { type: 'CHANGE_UPDATE_STATUS', payload: updateStatus }
}

export function switchSettingsView(value: boolean): SwitchSettingsViewAction {
  return { type: 'SWITCH_SETTINGS_VIEW', payload: value }
}

