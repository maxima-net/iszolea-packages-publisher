import { Settings, AnyAction } from '../types';
import { Reducer } from 'redux';

const initialState: Settings = {
  baseSlnPath: '',
  nuGetApiKey: '',
  uiPackageJsonPath: '',
  npmAutoLogin: false,
  npmLogin: '',
  npmPassword: '',
  npmEmail: '',

  isBaseSlnPathValid: false,
  isNuGetApiKeyValid: false,
  isUiPackageJsonPathValid: false,
  isNpmLoginValid: false,
  isNpmPasswordValid: false,
  isNpmEmailValid: false
}

const settingsReducer: Reducer<Settings, AnyAction> = (state = initialState, action) => {
  if (action.type === 'APPLY_SETTINGS') {
    return {
      ...action.payload
    };
  }

  return state;
}

export default settingsReducer;
