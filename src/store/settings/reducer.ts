import { Settings } from '../types';
import { Reducer } from 'redux';
import { SettingsAction } from './types';

const initialState: Settings = {
  isIszoleaPackagesIncluded: false,
  baseSlnPath: '',

  isIszoleaUiPackageIncluded: false,
  uiPackageJsonPath: '',

  isBomCommonPackageIncluded: false,
  bomCommonPackageSlnPath: '',

  isSmpCommonPackageIncluded: false,
  smpCommonPackageSlnPath: '',
  
  nuGetApiKey: '',
  
  npmAutoLogin: false,
  npmLogin: '',
  npmPassword: '',
  npmEmail: '',

  isBaseSlnPathValid: false,
  isNuGetApiKeyValid: false,
  isBomCommonPackageSlnPathValid: false,
  isSmpCommonPackageSlnPathValid: false,
  isUiPackageJsonPathValid: false,
  isNpmLoginValid: false,
  isNpmPasswordValid: false,
  isNpmEmailValid: false
};

const settingsReducer: Reducer<Settings, SettingsAction> = (state = initialState, action) => {
  if (action.type === 'APPLY_SETTINGS') {
    return {
      ...action.payload
    };
  }

  return state;
};

export default settingsReducer;
