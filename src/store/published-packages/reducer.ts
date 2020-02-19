import { PublishedPackages, PublishedPackagesLoadStatus } from '../types';
import { PublishedPackagesAction } from './types';

const initialState: PublishedPackages = {
  packageName: '',
  versions: [],
  status: PublishedPackagesLoadStatus.Unloaded
};

const publishedPackagesReducer = (state = initialState, action: PublishedPackagesAction): PublishedPackages => {
  switch (action.type) {
    case 'SET_PUBLISHED_VERSIONS':
      return {
        ...state,
        ...action.payload
      };

    default: return state;
  }
};

export default publishedPackagesReducer;
