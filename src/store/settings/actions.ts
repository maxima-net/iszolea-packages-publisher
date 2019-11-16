import { SettingsKeys, SettingsFields, Settings, AppState } from '../types';
import { ThunkAction } from 'redux-thunk';
import { decrypt, encrypt } from '../../utils/encryption';
import { validateSettings } from '../../utils/settings';
import { SettingsAction } from './types';
import { LayoutAction } from '../layout/types';
import Config from '../../utils/config';

export const loadSettings = () => {
  const config = new Config();
  
  const settingsFields: SettingsFields = {
    nuGetApiKey: decrypt(config.Get<string>(SettingsKeys.NuGetApiKey)),

    isIszoleaPackagesIncluded: config.Get<boolean>(SettingsKeys.IsIszoleaPackagesIncluded, false),
    baseSlnPath: config.Get<string>(SettingsKeys.BaseSlnPath),

    isBomCommonPackageIncluded: config.Get<boolean>(SettingsKeys.IsBomCommonPackageIncluded),
    bomCommonPackageSlnPath: config.Get<string>(SettingsKeys.BomCommonPackageSlnPath),

    isIszoleaUiPackageIncluded: config.Get<boolean>(SettingsKeys.IsIszoleaUiPackageIncluded, false),
    uiPackageJsonPath: config.Get<string>(SettingsKeys.UiPackageJsonPath),

    npmAutoLogin: config.Get<boolean>(SettingsKeys.NpmAutoLogin, false),
    npmLogin: config.Get<string>(SettingsKeys.NpmLogin),
    npmPassword: decrypt(config.Get<string>(SettingsKeys.NpmPassword)),
    npmEmail: config.Get<string>(SettingsKeys.NpmEmail)
  };

  return applySettingsCore(settingsFields);
};

export const applySettings = (settingsFields: SettingsFields) => {
  const config = new Config();

  config.Set(SettingsKeys.IsIszoleaPackagesIncluded, !!settingsFields.isIszoleaPackagesIncluded);
  config.Set(SettingsKeys.BaseSlnPath, settingsFields.baseSlnPath || '');
  
  config.Set(SettingsKeys.IsBomCommonPackageIncluded, !!settingsFields.isBomCommonPackageIncluded);
  config.Set(SettingsKeys.BomCommonPackageSlnPath, settingsFields.bomCommonPackageSlnPath || '');
  
  config.Set(SettingsKeys.NuGetApiKey, encrypt(settingsFields.nuGetApiKey || ''));

  config.Set(SettingsKeys.IsIszoleaUiPackageIncluded, !!settingsFields.isIszoleaUiPackageIncluded);
  config.Set(SettingsKeys.UiPackageJsonPath, settingsFields.uiPackageJsonPath || '');
  
  config.Set(SettingsKeys.NpmAutoLogin, !!settingsFields.npmAutoLogin);
  config.Set(SettingsKeys.NpmLogin, settingsFields.npmLogin || '');
  config.Set(SettingsKeys.NpmPassword, encrypt(settingsFields.npmPassword || ''));
  config.Set(SettingsKeys.NpmEmail, settingsFields.npmEmail || '');

  return applySettingsCore(settingsFields);
};

const applySettingsCore = (settingsFields: SettingsFields): ThunkAction<void, AppState, any, SettingsAction | LayoutAction> => {
  return (dispatch) => {
    const validationResult = validateSettings(settingsFields);
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
    };

    dispatch({ type: 'APPLY_SETTINGS', payload: settings });
    dispatch({ type: 'SWITCH_SETTINGS_VIEW', payload: !!mainError });
  };
};
