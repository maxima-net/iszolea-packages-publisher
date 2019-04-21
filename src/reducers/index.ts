import { AppState } from './types';
import { Action } from '../actions/types';

const initialState: AppState = {
  settings: {
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
  },
  displaySettings: false
}

export default function rootReducer(state: AppState = initialState, action: Action): AppState {
  if (action.type === 'APPLY_SETTINGS') {
    return {
      ...state,
      settings: {
        ...action.payload,
        isBaseSlnPathValid: true,
        isNuGetApiKeyValid: true,
        isUiPackageJsonPathValid: true,
        isNpmLoginValid: true,
        isNpmPasswordValid: true,
        isNpmEmailValid: true
      }
    }
  }

  if (action.type === 'CANCEL_SETTINGS') {
    return {
      ...state,
      displaySettings: false
    }
  }

  if (action.type === 'REJECT_SETTINGS') {
    return {
      ...state,
      settings: action.payload,
      displaySettings: true
    }
  }

  return state;
}
