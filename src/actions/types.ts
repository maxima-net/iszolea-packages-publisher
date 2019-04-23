import Redux from 'redux';
import { SettingsFields, Settings, UpdateStatus } from '../reducers/types';

interface ActionBase extends Redux.Action<string> {
  payload?: any;
}

export type Action = ApplySettingsAction | CancelSettingsAction | RejectSettingsAction | SwitchSettingsView
  | ChangeUpdateStatus;

export interface ApplySettingsAction extends ActionBase {
  type: 'APPLY_SETTINGS';
  payload: SettingsFields;
}

export interface CancelSettingsAction extends ActionBase {
  type: 'CANCEL_SETTINGS';
}

export interface RejectSettingsAction extends ActionBase {
  type: 'REJECT_SETTINGS';
  payload: Settings;
}

export interface SwitchSettingsView extends ActionBase {
  type: 'SWITCH_SETTINGS_VIEW';
  payload: boolean;
}

export interface ChangeUpdateStatus extends ActionBase {
  type: 'CHANGE_UPDATE_STATUS';
  payload: UpdateStatus;
}
