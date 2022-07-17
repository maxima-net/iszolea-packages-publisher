import { SettingsKeys, SettingsFields, Settings, ThunkAction, SolutionFields, NpmFields } from '../types';
import { validateSettings } from '../../utils/settings';
import Config from '../../utils/config';
import EncryptionService from '../../utils/encryption-service';
import { switchSettingsView } from '../layout/actions';
import { config } from '../../config';

export const loadSettings = () => {
  const configStorage = new Config();
  const encryptionService = new EncryptionService();

  const solutions: { [key: string]: SolutionFields } = {};
  for (const key in config.nuget.solutions) {
    solutions[key] = {
      isIncluded: configStorage.Get<boolean>(getIsIncludedKey(key), false),
      slnPath: configStorage.Get<string>(getRootFilePathKey(key))
    };
  }

  const npm: { [key: string]: NpmFields } = {};
  for (const key in config.npm.packages) {
    npm[key] = {
      isIncluded: configStorage.Get<boolean>(getIsIncludedKey(key), false),
      packageJsonPath: configStorage.Get<string>(getRootFilePathKey(key))
    };
  }

  const settingsFields: SettingsFields = {
    solutions,
    npm,

    nuGetApiKey: encryptionService.decrypt(configStorage.Get<string>(SettingsKeys.NuGetApiKey)),

    npmAutoLogin: configStorage.Get<boolean>(SettingsKeys.NpmAutoLogin, false),
    npmLogin: configStorage.Get<string>(SettingsKeys.NpmLogin),
    npmPassword: encryptionService.decrypt(configStorage.Get<string>(SettingsKeys.NpmPassword)),
    npmEmail: configStorage.Get<string>(SettingsKeys.NpmEmail)
  };

  return applySettingsCore(settingsFields);
};

export const applySettings = (settingsFields: SettingsFields) => {
  const configStorage = new Config();
  const encryptionService = new EncryptionService();

  for (const key in config.nuget.solutions) {
    const settings = settingsFields.solutions[key];
    configStorage.Set(getIsIncludedKey(key), settings ? !!settings.isIncluded : false);
    configStorage.Set(getRootFilePathKey(key), settings ? settings.slnPath || '' : '');
  }

  for (const key in config.npm.packages) {
    const settings = settingsFields.npm[key];
    configStorage.Set(getIsIncludedKey(key), settings ? !!settings.isIncluded : false);
    configStorage.Set(getRootFilePathKey(key), settings ? settings.packageJsonPath || '' : '');
  }

  configStorage.Set(SettingsKeys.NuGetApiKey, encryptionService.encrypt(settingsFields.nuGetApiKey || ''));

  configStorage.Set(SettingsKeys.NpmAutoLogin, !!settingsFields.npmAutoLogin);
  configStorage.Set(SettingsKeys.NpmLogin, settingsFields.npmLogin || '');
  configStorage.Set(SettingsKeys.NpmPassword, encryptionService.encrypt(settingsFields.npmPassword || ''));
  configStorage.Set(SettingsKeys.NpmEmail, settingsFields.npmEmail || '');

  return applySettingsCore(settingsFields);
};

const applySettingsCore = (settingsFields: SettingsFields): ThunkAction => {
  return (dispatch) => {
    const validationResult = validateSettings(settingsFields);
    const {
      solutionValidationResults, isNuGetApiKeyValid,
      npmValidationResults, isNpmLoginValid, isNpmPasswordValid, isNpmEmailValid,
      mainError
    } = validationResult;

    const settings: Settings = {
      ...settingsFields,
      solutionValidationResults,
      isNuGetApiKeyValid,

      npmValidationResults,
      isNpmLoginValid,
      isNpmPasswordValid,
      isNpmEmailValid,

      mainError
    };

    dispatch({ type: 'APPLY_SETTINGS', payload: settings });
    dispatch(switchSettingsView(!!mainError));
  };
};

interface LegacyKeys {
  isIncludedKey: string;
  rootFilePathKey: string;
}

const legacyKeys: { [key: string]: LegacyKeys } = {
  isozBase: {
    isIncludedKey: 'isIszoleaPackagesIncluded',
    rootFilePathKey: 'baseSlnPath'
  },
  smp: {
    isIncludedKey: 'isSmpCommonPackageIncluded',
    rootFilePathKey: 'smpCommonPackageSlnPath'
  },
  bomCommon: {
    isIncludedKey: 'isBomCommonPackageIncluded',
    rootFilePathKey: 'bomCommonPackageSlnPath'
  },
  space3Common: {
    isIncludedKey: 'isSpace3CommonPackageIncluded',
    rootFilePathKey: 'space3CommonPackageSlnPath'
  },
  reportsPortal: {
    isIncludedKey: 'IsReportsPortalPackageIncluded',
    rootFilePathKey: 'ReportsPortalPackageSlnPath'
  },
  iszoleaUi: {
    isIncludedKey: 'isIszoleaUiPackageIncluded',
    rootFilePathKey: 'uiPackageJsonPath'
  }
};

const getIsIncludedKey = (key: string) => {
  return (legacyKeys[key] && legacyKeys[key].isIncludedKey) || `${key}_isIncluded`;
};

const getRootFilePathKey = (key: string) => {
  return (legacyKeys[key] && legacyKeys[key].rootFilePathKey) || `${key}_rootFilePath`;
};