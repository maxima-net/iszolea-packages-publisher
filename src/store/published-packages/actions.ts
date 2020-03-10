import { ThunkAction, PublishedPackagesLoadStatus } from '../types';
import { SetPublishedVersions } from './types';

export const getPackageVersions = (): ThunkAction<SetPublishedVersions> => {
  return async (dispatch, getState) => {
    const state = getState();

    if(!state.publishing.selectedPackageSet) {
      return;
    }

    const packageSet = state.publishing.selectedPackageSet;
    const packageName = packageSet.projectsInfo[0].name;
    if (state.publishedPackages.packageName === packageName) {
      return;
    }

    dispatch({
      type: 'SET_PUBLISHED_VERSIONS',
      payload: {
        packageName,
        versions: [],
        status: PublishedPackagesLoadStatus.Loading
      }
    });

    const versions = await packageSet.getPublishedVersions();

    dispatch({
      type: 'SET_PUBLISHED_VERSIONS',
      payload: {
        packageName,
        versions,
        status: PublishedPackagesLoadStatus.Loaded 
      }
    });
  };
};
