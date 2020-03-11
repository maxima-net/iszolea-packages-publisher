import { PublishedPackages, PublishedPackagesLoadStatus } from '../types';
import { PublishedPackagesAction } from './types';

const initialState: PublishedPackages = {
  packageName: '',
  versions: [],
  status: PublishedPackagesLoadStatus.Unloaded,
  cache: new Map()
};

const publishedPackagesReducer = (state = initialState, action: PublishedPackagesAction): PublishedPackages => {
  switch (action.type) {
    case 'SET_PUBLISHED_VERSIONS':
      return {
        ...state,
        ...action.payload
      };

    case 'SET_PUBLISHED_VERSIONS_CACHE':
      return {
        ...state,
        cache: action.payload
      };

    default: return state;
  }
};

export default publishedPackagesReducer;
