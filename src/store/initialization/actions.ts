import { AppState, AnyAction } from '../types';
import { ThunkAction } from 'redux-thunk';
import NuGetHelper from '../../utils/nuget-helper';
import DotNetProjectHelper from '../../utils/dotnet-project-helper';
import NpmPackageHelper from '../../utils/npm-package-helper';

export const checkRequirements = (): ThunkAction<Promise<void>, AppState, any, AnyAction> => {
  return async (dispatch, getState) => {
    const initialization = getState().initialization;

    const isNuGetCommandAvailable = await NuGetHelper.checkCommandsAvailability();
    dispatch({ type: 'UPDATE_INITIALIZATION_INFO', payload: { ...initialization, isNuGetCommandAvailable } });

    const isDotNetCommandAvailable = await DotNetProjectHelper.checkCommandsAvailability();
    dispatch({ type: 'UPDATE_INITIALIZATION_INFO', payload: { ...initialization, isDotNetCommandAvailable } });

    const isNpmCommandAvailable = await NpmPackageHelper.checkCommandsAvailability();
    dispatch({ type: 'UPDATE_INITIALIZATION_INFO', payload: { ...initialization, isNpmCommandAvailable, isInitialized: true } });
  }
}
