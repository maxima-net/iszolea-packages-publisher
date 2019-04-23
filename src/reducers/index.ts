import { AppState, UpdateStatus } from './types';
import { Action } from '../actions/types';
import SettingsHelper from '../utils/settings-helper';

const initialState: AppState = {
  settings: {
    baseSlnPath: '',
    nuGetApiKey: '',
    uiPackageJsonPath: '',
    npmAutoLogin: false,
    npmLogin: '',
    npmPassword: '',
    npmEmail: '',

    hash: '',
    isBaseSlnPathValid: false,
    isNuGetApiKeyValid: false,
    isUiPackageJsonPathValid: false,
    isNpmLoginValid: false,
    isNpmPasswordValid: false,
    isNpmEmailValid: false
  },
  displaySettingsView: false,
  updateStatus: UpdateStatus.Checking,
  updateInfo: undefined
}

export default function rootReducer(state: AppState = initialState, action: Action): AppState {
  if (action.type === 'APPLY_SETTINGS') {
    const hash = SettingsHelper.getSettingsHash(action.payload.baseSlnPath, action.payload.nuGetApiKey,
      action.payload.uiPackageJsonPath, action.payload.npmLogin, action.payload.npmPassword,
      action.payload.npmEmail);

    return {
      ...state,
      settings: {
        ...action.payload,
        hash,
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
      displaySettingsView: false
    }
  }

  if (action.type === 'REJECT_SETTINGS') {
    return {
      ...state,
      settings: action.payload,
      displaySettingsView: true
    }
  }

  if (action.type === 'SWITCH_SETTINGS_VIEW') {
    return {
      ...state,
      displaySettingsView: action.payload
    }
  }

  if (action.type === 'REFUSE_UPDATE_INSTALLATION') {
    return {
      ...state,
      updateStatus: UpdateStatus.DeclinedByUser
    }
  }

  return state;
}
