import { AppState, Initialization } from '../types';
import { ThunkAction } from 'redux-thunk';
import * as NuGet from '../../utils/nuget';
import * as DotNet from '../../utils/dotnet-project';
import * as Npm from '../../utils/npm-package';
import * as Git from '../../utils/git';
import { SetInitialized, InitializationAction } from './types';
import { loadSettings } from '../settings/actions';

export const initialize = (): ThunkAction<Promise<void>, AppState, any, InitializationAction> => {
  return async (dispatch) => {
    let info: Initialization = {
      isInitialized: undefined,
      isNuGetCommandAvailable: undefined,
      isDotNetCommandAvailable: undefined,
      isNpmCommandAvailable: undefined,
      isGitCommandAvailable: undefined
    };

    const isNuGetCommandAvailablePromise = NuGet.checkCommandAvailability();
    isNuGetCommandAvailablePromise
      .then((isNuGetCommandAvailable) => {
        info = {
          ... info,
          isNuGetCommandAvailable
        };
        dispatch({ type: 'UPDATE_INITIALIZATION_INFO', payload: info });
      });

    const isDotNetCommandAvailablePromise = DotNet.checkCommandAvailability();
    isDotNetCommandAvailablePromise
      .then((isDotNetCommandAvailable) => {
        info = {
          ... info,
          isDotNetCommandAvailable
        };
        dispatch({ type: 'UPDATE_INITIALIZATION_INFO', payload: info });
      });

    const isNpmCommandAvailablePromise = Npm.checkCommandAvailability();
    isNpmCommandAvailablePromise
      .then((isNpmCommandAvailable) => {
        info = {
          ... info,
          isNpmCommandAvailable,
        };
        dispatch({ type: 'UPDATE_INITIALIZATION_INFO', payload: info });
      });

    const isGitCommandAvailablePromise = Git.checkCommandAvailability();
    isGitCommandAvailablePromise
      .then((isGitCommandAvailable) => {
        info = {
          ... info,
          isGitCommandAvailable,
        };
        dispatch({ type: 'UPDATE_INITIALIZATION_INFO', payload: info });
      });
  
    const [
      isNuGetCommandAvailable, 
      isDotNetCommandAvailable,
      isNpmCommandAvailable,
      isGitCommandAvailable
    ] = await Promise.all([
      isNuGetCommandAvailablePromise,
      isDotNetCommandAvailablePromise,
      isNpmCommandAvailablePromise,
      isGitCommandAvailablePromise
    ]);

    dispatch(loadSettings());

    const isInitialized = isNuGetCommandAvailable && isDotNetCommandAvailable && isNpmCommandAvailable && isGitCommandAvailable;
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
