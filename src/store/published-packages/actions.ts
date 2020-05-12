import { ThunkAction, PublishedPackagesLoadStatus, PackageVersionCache } from '../types';
import { PackageVersionInfo } from '../../version/nuget-versions-parser';
import { reloadVersionProviders } from '../publishing/actions';

const CACHE_LIFETIME_MS = 10 * 60 * 1000;

export const fetchPackageVersions = (forced: boolean): ThunkAction => {
  return async (dispatch, getState) => {
    const state = getState();

    const selectedPackageSet = state.publishing.selectedPackageSet;
    if (selectedPackageSet) {
      const packageName = selectedPackageSet.projectsInfo[0].name;

      dispatch({
        type: 'SET_PUBLISHED_VERSIONS',
        payload: {
          packageName,
          versions: [],
          lastUpdated: undefined,
          status: PublishedPackagesLoadStatus.Loading
        }
      });

      let versions: PackageVersionInfo[];
      let lastUpdated: Date | undefined;
      const cache = state.publishedPackages.cache;
      const cachedVersions = cache.get(packageName);
      const isCacheExpired = !!cachedVersions && new Date().getTime() - cachedVersions.lastUpdated.getTime() > CACHE_LIFETIME_MS;

      if (cachedVersions && !isCacheExpired && !forced) {
        versions = cachedVersions.data;
        lastUpdated = cachedVersions.lastUpdated;
      } else {
        versions = await selectedPackageSet.getPublishedVersions();

        const newCache = new Map<string, PackageVersionCache>(getState().publishedPackages.cache);
        lastUpdated = new Date();
        const cacheValue: PackageVersionCache = {
          data: versions,
          lastUpdated
        };
        newCache.set(packageName, cacheValue);

        dispatch({
          type: 'SET_PUBLISHED_VERSIONS_CACHE',
          payload: newCache
        });
      }

      if (getState().publishedPackages.packageName === packageName) {
        dispatch({
          type: 'SET_PUBLISHED_VERSIONS',
          payload: {
            packageName,
            versions,
            lastUpdated,
            status: PublishedPackagesLoadStatus.Loaded
          }
        });

        dispatch(reloadVersionProviders());
      }
    }
  };
};
