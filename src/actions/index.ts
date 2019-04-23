import { Settings, SettingsFields, UpdateStatus } from '../reducers/types';
import * as Action from './types';
import ConfigHelper from '../utils/config-helper';
import SettingsHelper from '../utils/settings-helper';

enum SettingsKeys {
  BaseSlnPath = 'baseSlnPath',
  NuGetApiKey = 'nuGetApiKey',
  UiPackageJsonPath = 'uiPackageJsonPath',
  NpmAutoLogin = 'npmAutoLogin',
  NpmLogin = 'npmLogin',
  NpmPassword = 'npmPassword',
  NpmEmail = 'npmEmail'
}

export function changeUpdateStatus(updateStatus: UpdateStatus): Action.ChangeUpdateStatus {
  return { type: 'CHANGE_UPDATE_STATUS', payload: updateStatus }
}

export function loadSettings(): Action.ApplySettingsAction {
  const baseSlnPath = ConfigHelper.Get<string>(SettingsKeys.BaseSlnPath);
  const nuGetApiKey = SettingsHelper.decrypt(ConfigHelper.Get<string>(SettingsKeys.NuGetApiKey));
  const uiPackageJsonPath = ConfigHelper.Get<string>(SettingsKeys.UiPackageJsonPath);
  const npmAutoLogin = ConfigHelper.Get<boolean>(SettingsKeys.NpmAutoLogin, false);
  const npmLogin = ConfigHelper.Get<string>(SettingsKeys.NpmLogin);
  const npmPassword = SettingsHelper.decrypt(ConfigHelper.Get<string>(SettingsKeys.NpmPassword));
  const npmEmail = ConfigHelper.Get<string>(SettingsKeys.NpmEmail);

  return {
    type: 'APPLY_SETTINGS',
    payload: {
      baseSlnPath, nuGetApiKey, uiPackageJsonPath,
      npmAutoLogin, npmLogin, npmPassword, npmEmail
    }
  };
}

export function applySettings(payload: SettingsFields): Action.ApplySettingsAction {
  ConfigHelper.Set(SettingsKeys.BaseSlnPath, payload.baseSlnPath || '');
  ConfigHelper.Set(SettingsKeys.NuGetApiKey, SettingsHelper.encrypt(payload.nuGetApiKey || ''));
  ConfigHelper.Set(SettingsKeys.UiPackageJsonPath, payload.uiPackageJsonPath || '');
  ConfigHelper.Set(SettingsKeys.NpmAutoLogin, payload.npmAutoLogin || '');
  ConfigHelper.Set(SettingsKeys.NpmLogin, payload.npmLogin || '');
  ConfigHelper.Set(SettingsKeys.NpmPassword, SettingsHelper.encrypt(payload.npmPassword || ''));
  ConfigHelper.Set(SettingsKeys.NpmEmail, payload.npmEmail || '');

  return { type: 'APPLY_SETTINGS', payload: payload};
}

export function cancelSettings(): Action.CancelSettingsAction {
  return { type: 'CANCEL_SETTINGS' };
}

export function rejectSettings(payload: Settings): Action.RejectSettingsAction {
  return { type: 'REJECT_SETTINGS', payload };
}

export function switchSettingsView(value: boolean): Action.SwitchSettingsView {
  return { type: 'SWITCH_SETTINGS_VIEW', payload: value }
}
