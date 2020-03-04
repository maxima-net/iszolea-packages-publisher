import { ThunkAction, PublishedPackagesLoadStatus } from '../types';
import { SetPublishedVersions } from './types';
import { getPackageVersions as getVersions } from '../../utils/nuget';
import { parseVersionsList } from '../../version/nuget-versions-parser';
import { sort } from '../../version/version-sorter';

export const getPackageVersions = (packageName: string): ThunkAction<SetPublishedVersions> => {
  return async (dispatch, getState) => {
    if (getState().publishedPackages.packageName === packageName) {
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

    const commandResult = await getVersions(packageName);
    const versions = commandResult.isSuccess && commandResult.data
      ? parseVersionsList(commandResult.data).sort(sort)
      : [];

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
