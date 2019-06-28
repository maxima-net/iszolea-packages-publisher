import * as Config from '../../utils/config';
import { SettingsKeys, SettingsFields, Settings, AppState } from '../types';
import { ThunkAction } from 'redux-thunk';
import { decrypt, encrypt } from '../../utils/encryption';
import { validateSettings } from '../../utils/settings';
import { SettingsAction } from './types';
import { LayoutAction } from '../layout/types';

export const loadSettings = () => {
  const settingsFields: SettingsFields = {
    nuGetApiKey: decrypt(Config.Get<string>(SettingsKeys.NuGetApiKey)),

    isIszoleaPackagesIncluded: Config.Get<boolean>(SettingsKeys.IsIszoleaPackagesIncluded, false),
    baseSlnPath: Config.Get<string>(SettingsKeys.BaseSlnPath),

    isBomCommonPackageIncluded: Config.Get<boolean>(SettingsKeys.IsBomCommonPackageIncluded),
    bomCommonPackageSlnPath: Config.Get<string>(SettingsKeys.BomCommonPackageSlnPath),

    isIszoleaUiPackageIncluded: Config.Get<boolean>(SettingsKeys.IsIszoleaUiPackageIncluded, false),
    uiPackageJsonPath: Config.Get<string>(SettingsKeys.UiPackageJsonPath),

    npmAutoLogin: Config.Get<boolean>(SettingsKeys.NpmAutoLogin, false),
    npmLogin: Config.Get<string>(SettingsKeys.NpmLogin),
    npmPassword: decrypt(Config.Get<string>(SettingsKeys.NpmPassword)),
    npmEmail: Config.Get<string>(SettingsKeys.NpmEmail)
  };

  return applySettingsCore(settingsFields)
}

export const applySettings = (settingsFields: SettingsFields) => {
  Config.Set(SettingsKeys.IsIszoleaPackagesIncluded, settingsFields.isIszoleaPackagesIncluded);
  Config.Set(SettingsKeys.BaseSlnPath, settingsFields.baseSlnPath || '');
  
  Config.Set(SettingsKeys.IsBomCommonPackageIncluded, settingsFields.isBomCommonPackageIncluded);
  Config.Set(SettingsKeys.BomCommonPackageSlnPath, settingsFields.bomCommonPackageSlnPath || '');
  
  Config.Set(SettingsKeys.NuGetApiKey, encrypt(settingsFields.nuGetApiKey || ''));

  Config.Set(SettingsKeys.IsIszoleaUiPackageIncluded, settingsFields.isIszoleaUiPackageIncluded);
  Config.Set(SettingsKeys.UiPackageJsonPath, settingsFields.uiPackageJsonPath || '');
  
  Config.Set(SettingsKeys.NpmAutoLogin, settingsFields.npmAutoLogin);
  Config.Set(SettingsKeys.NpmLogin, settingsFields.npmLogin || '');
  Config.Set(SettingsKeys.NpmPassword, encrypt(settingsFields.npmPassword || ''));
  Config.Set(SettingsKeys.NpmEmail, settingsFields.npmEmail || '');

  return applySettingsCore(settingsFields);
}

const applySettingsCore = (settingsFields: SettingsFields): ThunkAction<void, AppState, any, SettingsAction | LayoutAction> => {
  return (dispatch) => {
    const validationResult = validateSettings(settingsFields)
    const {isBaseSlnPathValid,isNuGetApiKeyValid, isUiPackageJsonPathValid, IsBomCommonPackageSlnPathValid,
      isNpmLoginValid, isNpmPasswordValid, isNpmEmailValid, mainError } = validationResult;

    const settings: Settings = {
      ...settingsFields,
      mainError,
      isBaseSlnPathValid,
      IsBomCommonPackageSlnPathValid,
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
