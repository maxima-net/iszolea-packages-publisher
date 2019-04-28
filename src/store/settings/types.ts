import { BaseAction, Settings } from '../types';

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

