import { Publishing } from '../types';
import { Reducer } from 'redux';
import { PublishingAction } from './types';

const initialState: Publishing = {
  availablePackages: [],
  selectedPackageSet: undefined,
  newVersion: '',
  newVersionError: undefined,
  versionProviderName: '',
  isEverythingCommitted: false,
  branchName: undefined,
  publishingInfo: undefined
};

const publishingReducer: Reducer<Publishing, PublishingAction> = (state = initialState, action) => {
  if (action.type === 'INITIALIZE_PUBLISHING') {
    return {
      ...state,
      availablePackages: action.payload,
      selectedPackageSet: undefined,
      versionProviderName: '',
      newVersion: '',
      newVersionError: undefined,
      isEverythingCommitted: undefined,
      publishingInfo: undefined
    };
  }

  if (action.type === 'UPDATE_GIT_INFO') {
    return {
      ...state,
      isEverythingCommitted: action.payload.isCommitted,
      branchName: action.payload.branchName
    };
  }

  if (action.type === 'APPLY_PROJECT') {
    return {
      ...state,
      selectedPackageSet: action.payload.packageSet,
      newVersion: action.payload.newVersion,
      newVersionError: action.payload.newVersionError,
      versionProviderName: action.payload.versionProviderName,
      isEverythingCommitted: action.payload.isEverythingCommitted
    };
  };

  if (action.type === 'APPLY_VERSION_PROVIDER') {
    return {
      ...state,
      versionProviderName: action.payload.versionProviderName,
      newVersion: action.payload.newVersion,
      newVersionError: action.payload.newVersionError,
    };
  };

  if (action.type === 'APPLY_NEW_VERSION') {
    return {
      ...state,
      newVersion: action.payload.newVersion,
      newVersionError: action.payload.newVersionError
    };
  }

  if (action.type === 'UPDATE_PUBLISHING_INFO') {
    return {
      ...state,
      publishingInfo: action.payload
    };
  };

  return state;
};

export default publishingReducer;
