import { BaseAction, Settings } from '../types';

export interface ApplySettingsAction extends BaseAction {
  type: 'APPLY_SETTINGS';
  payload: Settings;
}

export type SettingsAction = ApplySettingsAction;
