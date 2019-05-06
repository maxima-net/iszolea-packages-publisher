import ConfigHelper from '../../utils/config-helper';
import SettingsHelper from '../../utils/settings-helper';
import { SettingsKeys, SettingsFields, Settings, AppState, AnyAction } from '../types';
import { ThunkAction } from 'redux-thunk';

export const loadSettings = () => {
  const settingsFields = {
    baseSlnPath: ConfigHelper.Get<string>(SettingsKeys.BaseSlnPath),
    nuGetApiKey: SettingsHelper.decrypt(ConfigHelper.Get<string>(SettingsKeys.NuGetApiKey)),
    uiPackageJsonPath: ConfigHelper.Get<string>(SettingsKeys.UiPackageJsonPath),
    npmAutoLogin: ConfigHelper.Get<boolean>(SettingsKeys.NpmAutoLogin, false),
    npmLogin: ConfigHelper.Get<string>(SettingsKeys.NpmLogin),
    npmPassword: SettingsHelper.decrypt(ConfigHelper.Get<string>(SettingsKeys.NpmPassword)),
    npmEmail: ConfigHelper.Get<string>(SettingsKeys.NpmEmail)
  };

  return applySettingsCore(settingsFields)
}

export const applySettings = (settingsFields: SettingsFields) => {
  ConfigHelper.Set(SettingsKeys.BaseSlnPath, settingsFields.baseSlnPath || '');
  ConfigHelper.Set(SettingsKeys.NuGetApiKey, SettingsHelper.encrypt(settingsFields.nuGetApiKey || ''));
  ConfigHelper.Set(SettingsKeys.UiPackageJsonPath, settingsFields.uiPackageJsonPath || '');
  ConfigHelper.Set(SettingsKeys.NpmAutoLogin, settingsFields.npmAutoLogin || '');
  ConfigHelper.Set(SettingsKeys.NpmLogin, settingsFields.npmLogin || '');
  ConfigHelper.Set(SettingsKeys.NpmPassword, SettingsHelper.encrypt(settingsFields.npmPassword || ''));
  ConfigHelper.Set(SettingsKeys.NpmEmail, settingsFields.npmEmail || '');

  return applySettingsCore(settingsFields);
}

const applySettingsCore = (settingsFields: SettingsFields): ThunkAction<void, AppState, any, AnyAction> => {
  return (dispatch) => {
    const validationResult = SettingsHelper.validateSettings(settingsFields)
    const {isBaseSlnPathValid,isNuGetApiKeyValid, isUiPackageJsonPathValid,
      isNpmLoginValid, isNpmPasswordValid, isNpmEmailValid, mainError } = validationResult;

    const settings: Settings = {
      ...settingsFields,
      mainError,
      isBaseSlnPathValid,
      isNuGetApiKeyValid,
      isUiPackageJsonPathValid,
      isNpmLoginValid,
      isNpmPasswordValid,
      isNpmEmailValid
    }

    dispatch({ type: 'APPLY_SETTINGS', payload: settings });
    dispatch({ type: 'SWITCH_SETTINGS_VIEW', payload: !!mainError });
  };
}
