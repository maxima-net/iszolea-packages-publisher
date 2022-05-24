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

  isSpace3CommonPackageIncluded: false,
  space3CommonPackageSlnPath: '',

  isReportsPortalPackageIncluded: false,
  reportsPortalPackageSlnPath: '',
  
  nuGetApiKey: '',
  
  npmAutoLogin: false,
  npmLogin: '',
  npmPassword: '',
  npmEmail: '',

  isBaseSlnPathValid: false,
  isNuGetApiKeyValid: false,
  isBomCommonPackageSlnPathValid: false,
  isSmpCommonPackageSlnPathValid: false,
  isSpace3CommonPackageSlnPathValid: false,
  isReportsPortalPackageSlnPathValid: false,
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
