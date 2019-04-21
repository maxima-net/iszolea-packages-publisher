import PathHelper from '../utils/path-helper';
import SettingsHelper from '../utils/settings-helper';
import { rejectSettings } from '../actions';
import { Action } from '../actions/types';

interface Dispatcher {
  dispatch: (action: Action) => void;
}

export function settingsCheckingMiddleware({ dispatch }: Dispatcher) {
  return function (next: (action: Action) => void) {
    return function (action: Action) {
      if (action.type === 'APPLY_SETTINGS') {

        const isBaseSlnPathValid = PathHelper.checkBaseSlnPath(action.payload.baseSlnPath);
        const isNuGetApiKeyValid = SettingsHelper.checkNuGetApiKeyIsCorrect(action.payload.nuGetApiKey);
        const isUiPackageJsonPathValid = PathHelper.checkUiPackageJsonPath(action.payload.uiPackageJsonPath);
        const isNpmLoginValid = SettingsHelper.checkNpmLoginIsCorrect(action.payload.npmLogin);
        const isNpmPasswordValid = SettingsHelper.checkNpmPasswordIsCorrect(action.payload.npmPassword);
        const isNpmEmailValid = SettingsHelper.checkNpmEmailIsCorrect(action.payload.npmEmail);

        const hasErrors = isBaseSlnPathValid || isNuGetApiKeyValid || isUiPackageJsonPathValid ||
          isNpmLoginValid || isNpmPasswordValid || isNpmEmailValid;

        const mainError = hasErrors ? 'Some required settings are not provided' : undefined;
        /* TODO: refactor */
        const hash = SettingsHelper.getSettingsHash(action.payload.baseSlnPath, action.payload.nuGetApiKey,
          action.payload.uiPackageJsonPath, action.payload.npmLogin, action.payload.npmPassword,
          action.payload.npmEmail);

        if (!isBaseSlnPathValid) {
          return dispatch(
            rejectSettings({
              ...action.payload,
              hash,
              mainError,
              isBaseSlnPathValid,
              isNuGetApiKeyValid,
              isUiPackageJsonPathValid,
              isNpmLoginValid,
              isNpmPasswordValid,
              isNpmEmailValid
            })
          );
        }
      }
      return next(action);
    };
  };
}
