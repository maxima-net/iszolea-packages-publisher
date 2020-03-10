import { ThunkAction, PublishedPackagesLoadStatus } from '../types';
import { PackageVersionInfo } from '../../version/nuget-versions-parser';

export const fetchPackageVersions = (forced: boolean): ThunkAction => {
  return async (dispatch, getState) => {
    const state = getState();

    if (state.publishing.selectedPackageSet) {
      const packageSet = state.publishing.selectedPackageSet;
      const packageName = packageSet.projectsInfo[0].name;
      if (state.publishedPackages.packageName !== packageName || forced) {
        dispatch({
          type: 'SET_PUBLISHED_VERSIONS',
          payload: {
            packageName,
            versions: [],
            status: PublishedPackagesLoadStatus.Loading
          }
        });


        let versions: PackageVersionInfo[];
        const cache = state.publishedPackages.cache;
        const cachedVersions = cache.get(packageName);

        if (cachedVersions && !forced) {
          versions = cachedVersions;
        } else {
          versions = await packageSet.getPublishedVersions();
          const newCache = new Map<string, PackageVersionInfo[]>(cache);
          newCache.set(packageName, versions);

          dispatch({
            type: 'SET_PUBLISHED_VERSIONS_CACHE',
            payload: newCache
          });
        }

        dispatch({
          type: 'SET_PUBLISHED_VERSIONS',
          payload: {
            packageName,
            versions,
            status: PublishedPackagesLoadStatus.Loaded
          }
        });
      }
    }
  };
};
