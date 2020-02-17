import { Initialization, ThunkAction } from '../types';
import { loadSettings } from '../settings/actions';
import { CommandTester } from '../../utils/command-tester';
import { replace } from 'connected-react-router';
import routes from '../../routes';

export const initialize = (): ThunkAction => {
  return async (dispatch) => {
    let info: Initialization = {
      isInitialized: undefined,
      isNuGetCommandAvailable: undefined,
      isDotNetCommandAvailable: undefined,
      isNpmCommandAvailable: undefined,
      isGitCommandAvailable: undefined
    };

    const commandTester = new CommandTester();

    const isNuGetCommandAvailablePromise = commandTester.checkNugetAvailability();
    isNuGetCommandAvailablePromise
      .then((isNuGetCommandAvailable) => {
        info = {
          ...info,
          isNuGetCommandAvailable
        };
        dispatch({ type: 'UPDATE_INITIALIZATION_INFO', payload: info });
      });

    const isDotNetCommandAvailablePromise = commandTester.checkDotNetAvailability();
    isDotNetCommandAvailablePromise
      .then((isDotNetCommandAvailable) => {
        info = {
          ...info,
          isDotNetCommandAvailable
        };
        dispatch({ type: 'UPDATE_INITIALIZATION_INFO', payload: info });
      });

    const isNpmCommandAvailablePromise = commandTester.checkNpmAvailability();
    isNpmCommandAvailablePromise
      .then((isNpmCommandAvailable) => {
        info = {
          ...info,
          isNpmCommandAvailable,
        };
        dispatch({ type: 'UPDATE_INITIALIZATION_INFO', payload: info });
      });

    const isGitCommandAvailablePromise = commandTester.checkGitAvailability();
    isGitCommandAvailablePromise
      .then((isGitCommandAvailable) => {
        info = {
          ...info,
          isGitCommandAvailable,
        };
        dispatch({ type: 'UPDATE_INITIALIZATION_INFO', payload: info });
      });

    const commandsResults = await Promise.all([
      isNuGetCommandAvailablePromise,
      isDotNetCommandAvailablePromise,
      isNpmCommandAvailablePromise,
      isGitCommandAvailablePromise
    ]);

    dispatch(loadSettings());

    const isInitialized = commandsResults.every((r) => r);
    dispatch(setInitialized(isInitialized));
  };
};

export const setInitialized: (isInitialized: boolean) => ThunkAction = (isInitialized) => {
  return (dispatch, getState) => {
    dispatch({ type: 'SET_INITIALIZED', payload: isInitialized });

    const hasSettingsError = !!getState().settings.mainError;

    if(hasSettingsError) {
      dispatch(replace(routes.settings));
    } else if (isInitialized) {
      dispatch(replace(routes.publishSetup));
    }
  };
};
