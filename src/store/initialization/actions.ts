import { AppState, AnyAction } from '../types';
import { ThunkAction } from 'redux-thunk';
import NuGetHelper from '../../utils/nuget-helper';
import DotNetProjectHelper from '../../utils/dotnet-project-helper';
import NpmPackageHelper from '../../utils/npm-package-helper';

export const checkRequirements = (): ThunkAction<Promise<void>, AppState, any, AnyAction> => {
  return async (dispatch, getState) => {
    let info = getState().initialization;

    const isNuGetCommandAvailable = await NuGetHelper.checkCommandsAvailability();
    info = {
      ... info,
      isNuGetCommandAvailable
    };
    dispatch({ type: 'UPDATE_INITIALIZATION_INFO', payload: info });

    const isDotNetCommandAvailable = await DotNetProjectHelper.checkCommandsAvailability();
    info = {
      ... info,
      isDotNetCommandAvailable
    };
    dispatch({ type: 'UPDATE_INITIALIZATION_INFO', payload: info });

    const isNpmCommandAvailable = await NpmPackageHelper.checkCommandsAvailability();
    const isInitialized = isNuGetCommandAvailable && isDotNetCommandAvailable && isNpmCommandAvailable;
    info = {
      ... info,
      isNpmCommandAvailable,
      isInitialized
    };
    dispatch({ type: 'UPDATE_INITIALIZATION_INFO', payload: info });
  }
}
