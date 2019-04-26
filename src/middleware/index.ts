import PathHelper, { PackageSet } from '../utils/path-helper';
import SettingsHelper from '../utils/settings-helper';
import { rejectSettings } from '../actions';
import { AnyAction } from '../actions/types';
import { AppState } from '../reducers/types';
import DotNetProjectHelper from '../utils/dotnet-project-helper';
import NpmPackageHelper from '../utils/npm-package-helper';
import { VersionProvider, VersionProviderFactory } from '../version-providers';

export { selectProjectMiddleware } from './selectProjectMiddleware';

export interface Dispatcher {
  dispatch: (action: AnyAction) => void;
}

export function settingsCheckingMiddleware({ dispatch }: Dispatcher) {
  return function (next: (action: AnyAction) => void) {
    return function (action: AnyAction) {
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

export function getCurrentVersion(packageSet: PackageSet, state: AppState): string {
  if (!packageSet)
    return ''

  if (packageSet.isNuget) {
    const packageName = packageSet.projectsInfo[0].name;
    return packageName !== '' ? DotNetProjectHelper.getLocalPackageVersion(state.settings.baseSlnPath, packageName) || '' : '';
  } else {
    return NpmPackageHelper.getLocalPackageVersion(state.settings.uiPackageJsonPath) || '';
  }
}

export function getVersionProviders(currentVersion: string): VersionProvider[] {
  return new VersionProviderFactory(currentVersion).getProviders();
}
