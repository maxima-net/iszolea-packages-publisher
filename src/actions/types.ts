import Redux from 'redux';
import { SettingsFields, Settings } from '../reducers/types';

interface ActionBase extends Redux.Action<string> {
  payload?: any;
}

export type Action = ApplySettingsAction | CancelSettingsAction | RejectSettingsAction;

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
