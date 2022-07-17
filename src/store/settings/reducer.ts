import { Settings } from '../types';
import { Reducer } from 'redux';
import { SettingsAction } from './types';

const initialState: Settings = {
  solutions: {},
  npm: {},
  nuGetApiKey: '',

  npmAutoLogin: false,
  npmLogin: '',
  npmPassword: '',
  npmEmail: '',

  solutionValidationResults: {},
  npmValidationResults: {},
  isNuGetApiKeyValid: false,
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
