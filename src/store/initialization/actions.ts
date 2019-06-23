import { AppState, Initialization } from '../types';
import { ThunkAction } from 'redux-thunk';
import * as NuGet from '../../utils/nuget';
import * as DotNet from '../../utils/dotnet-project';
import * as Npm from '../../utils/npm-package';
import { SetInitialized, InitializationAction } from './types';
import { loadSettings } from '../settings/actions';

export const initialize = (): ThunkAction<Promise<void>, AppState, any, InitializationAction> => {
  return async (dispatch) => {
    let info: Initialization = {
      isInitialized: undefined,
      isNuGetCommandAvailable: undefined,
      isDotNetCommandAvailable: undefined,
      isNpmCommandAvailable: undefined
    };

    const isNuGetCommandAvailablePromise = NuGet.checkCommandsAvailability();
    isNuGetCommandAvailablePromise
      .then((isNuGetCommandAvailable) => {
        info = {
          ... info,
          isNuGetCommandAvailable
        };
        dispatch({ type: 'UPDATE_INITIALIZATION_INFO', payload: info });
      });

    const isDotNetCommandAvailablePromise = DotNet.checkCommandsAvailability();
    isDotNetCommandAvailablePromise
      .then((isDotNetCommandAvailable) => {
        info = {
          ... info,
          isDotNetCommandAvailable
        };
        dispatch({ type: 'UPDATE_INITIALIZATION_INFO', payload: info });
      });

    const isNpmCommandAvailablePromise = Npm.checkCommandsAvailability();
    isNpmCommandAvailablePromise
      .then((isNpmCommandAvailable) => {
        info = {
          ... info,
          isNpmCommandAvailable,
        };
        dispatch({ type: 'UPDATE_INITIALIZATION_INFO', payload: info });
      });
    
    const [
      isNuGetCommandAvailable, 
      isDotNetCommandAvailable,
      isNpmCommandAvailable
    ] = await Promise.all([
      isNuGetCommandAvailablePromise,
      isDotNetCommandAvailablePromise,
      isNpmCommandAvailablePromise 
    ]);

    dispatch(loadSettings());
    const isInitialized = isNuGetCommandAvailable && isDotNetCommandAvailable && isNpmCommandAvailable;
    info = {
      ... info,
      isInitialized
    };
    dispatch({ type: 'UPDATE_INITIALIZATION_INFO', payload: info });
  }
}

export const setInitialized = (isInitialized: boolean): SetInitialized => {
  return { type: 'SET_INITIALIZED', payload: isInitialized };
}
