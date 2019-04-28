import { AnyAction, AppState, UpdateStatus } from '../store/types';
import PathHelper from '../utils/path-helper';

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
  layout: {
    displaySettingsView: false,
    updateStatus: UpdateStatus.Checking,
    updateInfo: undefined,
  },
  publishing: {
    availablePackages: [],
    packageSetId: undefined,
    isCustomVersionSelection: false,
    newVersion: '',
    versionProviderName: '',
    isEverythingCommitted: false,
    publishingInfo: undefined
  }
}

export default function rootReducer(state: AppState = initialState, action: AnyAction): AppState {
  if (action.type === 'APPLY_SETTINGS') {
    return {
      ...state,
      settings: action.payload.settings,
      layout: {
        ...state.layout,
        displaySettingsView: action.payload.displaySettingsView
      }
    };
  }

  if (action.type === 'CANCEL_SETTINGS') {
    return {
      ...state,
      layout: {
        ...state.layout,
        displaySettingsView: false
      }
    };
  }

  if (action.type === 'REJECT_SETTINGS') {
    return {
      ...state,
      settings: action.payload,
      layout: {
        ...state.layout,
        displaySettingsView: true
      }
    };
  }

  if (action.type === 'SWITCH_SETTINGS_VIEW') {
    return {
      ...state,
      layout: {
        ...state.layout,
        displaySettingsView: action.payload
      }
    };
  }

  if (action.type === 'CHANGE_UPDATE_STATUS') {
    return {
      ...state,
      layout: {
        ...state.layout,
        updateStatus: action.payload
      }
    };
  }

  if (action.type === 'INITIALIZE_PUBLISHING') {
    return {
      ...state,
      publishing: {
        ...state.publishing,
        packageSetId: undefined,
        availablePackages: PathHelper.getPackagesSets(state.settings.baseSlnPath, state.settings.uiPackageJsonPath),
        versionProviderName: '',
        newVersion: '',
        isCustomVersionSelection: false,
        isEverythingCommitted: undefined,
        publishingInfo: undefined
      }
    };
  }

  if (action.type === 'UPDATE_GIT_STATUS') {
    return {
      ...state,
      publishing: {
        ...state.publishing,
        isEverythingCommitted: action.payload
      }
    };
  }

  if (action.type === 'APPLY_PROJECT') {
    return {
      ...state,
      publishing: {
        ...state.publishing,
        packageSetId: action.payload.packageSetId,
        newVersion: action.payload.newVersion,
        versionProviderName: action.payload.versionProviderName,
        isCustomVersionSelection: action.payload.isCustomVersionSelection,
        isEverythingCommitted: action.payload.isEverythingCommitted
      }
    };
  }

  if (action.type === 'APPLY_VERSION_PROVIDER') {
    return {
      ...state,
      publishing: {
        ...state.publishing,
        versionProviderName: action.payload.versionProviderName,
        newVersion: action.payload.newVersion,
        isCustomVersionSelection: action.payload.isCustomVersionSelection
      }
    };
  }

  if (action.type === 'APPLY_NEW_VERSION') {
    if (state.publishing.isCustomVersionSelection) {
      return {
        ...state,
        publishing: {
          ...state.publishing,
          newVersion: action.payload
        }
      };
    }
  }

  if (action.type === 'UPDATE_PUBLISHING_INFO') {
    return {
      ...state,
      publishing: {
        ...state.publishing,
        publishingInfo: action.payload
      }
    };
  }

  return state;
}
