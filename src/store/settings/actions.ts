import { SettingsKeys, SettingsFields, Settings, ThunkAction } from '../types';
import { validateSettings } from '../../utils/settings';
import Config from '../../utils/config';
import EncryptionService from '../../utils/encryption-service';
import { switchSettingsView } from '../layout/actions';

export const loadSettings = () => {
  const config = new Config();
  const encryptionService = new EncryptionService();

  const settingsFields: SettingsFields = {
    nuGetApiKey: encryptionService.decrypt(config.Get<string>(SettingsKeys.NuGetApiKey)),

    isIszoleaPackagesIncluded: config.Get<boolean>(SettingsKeys.IsIszoleaPackagesIncluded, false),
    baseSlnPath: config.Get<string>(SettingsKeys.BaseSlnPath),

    isBomCommonPackageIncluded: config.Get<boolean>(SettingsKeys.IsBomCommonPackageIncluded),
    bomCommonPackageSlnPath: config.Get<string>(SettingsKeys.BomCommonPackageSlnPath),

    isSmpCommonPackageIncluded: config.Get<boolean>(SettingsKeys.IsSmpCommonPackageIncluded),
    smpCommonPackageSlnPath: config.Get<string>(SettingsKeys.SmpCommonPackageSlnPath),

    isSpace3CommonPackageIncluded: config.Get<boolean>(SettingsKeys.IsSpace3CommonPackageIncluded),
    space3CommonPackageSlnPath: config.Get<string>(SettingsKeys.Space3CommonPackageSlnPath),

    isIszoleaUiPackageIncluded: config.Get<boolean>(SettingsKeys.IsIszoleaUiPackageIncluded, false),
    uiPackageJsonPath: config.Get<string>(SettingsKeys.UiPackageJsonPath),

    npmAutoLogin: config.Get<boolean>(SettingsKeys.NpmAutoLogin, false),
    npmLogin: config.Get<string>(SettingsKeys.NpmLogin),
    npmPassword: encryptionService.decrypt(config.Get<string>(SettingsKeys.NpmPassword)),
    npmEmail: config.Get<string>(SettingsKeys.NpmEmail)
  };

  return applySettingsCore(settingsFields);
};

export const applySettings = (settingsFields: SettingsFields) => {
  const config = new Config();
  const encryptionService = new EncryptionService();

  config.Set(SettingsKeys.IsIszoleaPackagesIncluded, !!settingsFields.isIszoleaPackagesIncluded);
  config.Set(SettingsKeys.BaseSlnPath, settingsFields.baseSlnPath || '');

  config.Set(SettingsKeys.IsBomCommonPackageIncluded, !!settingsFields.isBomCommonPackageIncluded);
  config.Set(SettingsKeys.BomCommonPackageSlnPath, settingsFields.bomCommonPackageSlnPath || '');

  config.Set(SettingsKeys.IsSmpCommonPackageIncluded, !!settingsFields.isSmpCommonPackageIncluded);
  config.Set(SettingsKeys.SmpCommonPackageSlnPath, settingsFields.smpCommonPackageSlnPath || '');

  config.Set(SettingsKeys.IsSpace3CommonPackageIncluded, !!settingsFields.isSpace3CommonPackageIncluded);
  config.Set(SettingsKeys.Space3CommonPackageSlnPath, settingsFields.space3CommonPackageSlnPath || '');

  config.Set(SettingsKeys.NuGetApiKey, encryptionService.encrypt(settingsFields.nuGetApiKey || ''));

  config.Set(SettingsKeys.IsIszoleaUiPackageIncluded, !!settingsFields.isIszoleaUiPackageIncluded);
  config.Set(SettingsKeys.UiPackageJsonPath, settingsFields.uiPackageJsonPath || '');

  config.Set(SettingsKeys.NpmAutoLogin, !!settingsFields.npmAutoLogin);
  config.Set(SettingsKeys.NpmLogin, settingsFields.npmLogin || '');
  config.Set(SettingsKeys.NpmPassword, encryptionService.encrypt(settingsFields.npmPassword || ''));
  config.Set(SettingsKeys.NpmEmail, settingsFields.npmEmail || '');

  return applySettingsCore(settingsFields);
};

const applySettingsCore = (settingsFields: SettingsFields): ThunkAction => {
  return (dispatch) => {
    const validationResult = validateSettings(settingsFields);
    const { isBaseSlnPathValid, isNuGetApiKeyValid, isUiPackageJsonPathValid, isBomCommonPackageSlnPathValid,
      isSmpCommonPackageSlnPathValid, isSpace3CommonPackageSlnPathValid, isNpmLoginValid, isNpmPasswordValid, 
      isNpmEmailValid, mainError } = validationResult;

    const settings: Settings = {
      ...settingsFields,
      mainError,
      isBaseSlnPathValid,
      isBomCommonPackageSlnPathValid,
      isSmpCommonPackageSlnPathValid,
      isSpace3CommonPackageSlnPathValid,
      isNuGetApiKeyValid,
      isUiPackageJsonPathValid,
      isNpmLoginValid,
      isNpmPasswordValid,
      isNpmEmailValid
    };

    dispatch({ type: 'APPLY_SETTINGS', payload: settings });
    dispatch(switchSettingsView(!!mainError));
  };
};
