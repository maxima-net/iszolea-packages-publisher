import { Publishing } from '../types';
import { Reducer } from 'redux';
import { PublishingAction } from './types';

const initialState: Publishing = {
  availablePackages: [],
  packageSetId: undefined,
  isCustomVersionSelection: false,
  newVersion: '',
  versionProviderName: '',
  isEverythingCommitted: false,
  publishingInfo: undefined
}

const publishingReducer: Reducer<Publishing, PublishingAction> = (state = initialState, action) => {
  if (action.type === 'INITIALIZE_PUBLISHING') {
    return {
      ...state,
      availablePackages: action.payload,
      packageSetId: undefined,
      versionProviderName: '',
      newVersion: '',
      isCustomVersionSelection: false,
      isEverythingCommitted: undefined,
      publishingInfo: undefined
    };
  }

  if (action.type === 'UPDATE_GIT_STATUS') {
    return {
      ...state,
      isEverythingCommitted: action.payload
    };
  }

  if (action.type === 'APPLY_PROJECT') {
    return {
      ...state,
      packageSetId: action.payload.packageSetId,
      newVersion: action.payload.newVersion,
      versionProviderName: action.payload.versionProviderName,
      isCustomVersionSelection: action.payload.isCustomVersionSelection,
      isEverythingCommitted: action.payload.isEverythingCommitted
    }
  };

  if (action.type === 'APPLY_VERSION_PROVIDER') {
    return {
      ...state,
      versionProviderName: action.payload.versionProviderName,
      newVersion: action.payload.newVersion,
      isCustomVersionSelection: action.payload.isCustomVersionSelection
    }
  };

  if (action.type === 'APPLY_NEW_VERSION') {
    if (state.isCustomVersionSelection) {
      return {
        ...state,
        newVersion: action.payload
      }
    };
  }

  if (action.type === 'UPDATE_PUBLISHING_INFO') {
    return {
      ...state,
      publishingInfo: action.payload
    }
  };

  return state;
}

export default publishingReducer;
