import { AppState, AnyAction, Initialization } from '../types';
import { ThunkAction } from 'redux-thunk';
import NuGetHelper from '../../utils/nuget-helper';
import DotNetProjectHelper from '../../utils/dotnet-project-helper';
import NpmPackageHelper from '../../utils/npm-package-helper';
import { SetInitialized } from './types';

export const checkRequirements = (): ThunkAction<Promise<void>, AppState, any, AnyAction> => {
  return async (dispatch) => {
    let info: Initialization = {
      isInitialized: undefined,
      isNuGetCommandAvailable: undefined,
      isDotNetCommandAvailable: undefined,
      isNpmCommandAvailable: undefined
    };

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

export const setInitialized = (isInitialized: boolean): SetInitialized => {
  return { type: 'SET_INITIALIZED', payload: isInitialized };
}
