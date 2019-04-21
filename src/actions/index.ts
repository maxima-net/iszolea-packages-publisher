import { Settings, SettingsFields } from '../reducers/types';
import * as Action from './types';

export function applySettings(payload: SettingsFields): Action.ApplySettingsAction {
  return { type: 'APPLY_SETTINGS', payload };
}

export function cancelSettings(): Action.CancelSettingsAction {
  return { type: 'CANCEL_SETTINGS' };
}

export function rejectSettings(payload: Settings): Action.RejectSettingsAction {
  return { type: 'REJECT_SETTINGS', payload };
}
