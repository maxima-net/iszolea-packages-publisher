import { ThunkAction, PublishedPackagesLoadStatus } from '../types';
import { SetPublishedVersions } from './types';
import { getPackageVersions as getVersions } from '../../utils/nuget';
import { parseVersionsList } from '../../version/nuget-versions-parser';
import { IszoleaVersionInfo } from '../../version/version';

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
      ? parseVersionsList(commandResult.data).sort((a, b) => {
        if (!a.parsedVersion || !b.parsedVersion) {
          return b.rawVersion.localeCompare(a.rawVersion);
        }

        const va = a.parsedVersion;
        const vb = b.parsedVersion;

        if (va.major !== vb.major) {
          return vb.major - va.major;
        } else if (va.minor !== vb.minor) {
          return vb.minor - va.minor;
        } else if (va.patch !== vb.patch) {
          return vb.patch - va.patch;
        } else {
          return (vb.betaIndex || Number.MAX_VALUE) - (va.betaIndex || Number.MAX_VALUE);
        }
      })
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
