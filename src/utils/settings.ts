import { checkBaseSlnPath, checkUiPackageJsonPath } from './path';
import { SettingsValidationResult, SettingsFields } from '../store/types';

export function validateSettings(settings: SettingsFields): SettingsValidationResult {
  const { isIszoleaPackagesIncluded, baseSlnPath, isIszoleaUiPackageIncluded, uiPackageJsonPath,
    nuGetApiKey, npmAutoLogin, npmLogin, npmPassword, npmEmail } = settings;

  const isBaseSlnPathValid = !isIszoleaPackagesIncluded || checkBaseSlnPath(baseSlnPath);
  const isNuGetApiKeyValid = !isIszoleaPackagesIncluded || checkNuGetApiKeyIsCorrect(nuGetApiKey);
  const isUiPackageJsonPathValid = !isIszoleaUiPackageIncluded || checkUiPackageJsonPath(uiPackageJsonPath);
  const isNpmLoginValid = checkNpmLoginIsCorrect(npmLogin);
  const isNpmPasswordValid = checkNpmPasswordIsCorrect(npmPassword);
  const isNpmEmailValid = checkNpmEmailIsCorrect(npmEmail);

  const atLeastOneOptionIsSelected = isIszoleaPackagesIncluded || isIszoleaUiPackageIncluded;
  const areNpmSettingsAreValid = !isIszoleaUiPackageIncluded || !npmAutoLogin || isNpmLoginValid && isNpmPasswordValid && isNpmEmailValid;
  const areSettingsValid = isBaseSlnPathValid && isNuGetApiKeyValid && isUiPackageJsonPathValid && areNpmSettingsAreValid && atLeastOneOptionIsSelected;
  const mainError = !areSettingsValid 
    ? !atLeastOneOptionIsSelected 
      ? 'Chose at least one option, please'
      : 'Some required settings are not provided or incorrect' 
    : undefined;

  return {
    isBaseSlnPathValid,
    isNuGetApiKeyValid,
    isUiPackageJsonPathValid,
    isNpmLoginValid,
    isNpmPasswordValid,
    isNpmEmailValid,
    mainError
  }
}

export function checkNuGetApiKeyIsCorrect(nuGetApiKey: string) {
  return !!nuGetApiKey;
}

export function checkNpmLoginIsCorrect(npmLogin: string) {
  return !!npmLogin;
}

export function checkNpmPasswordIsCorrect(npmPassword: string) {
  return !!npmPassword;
}

export function checkNpmEmailIsCorrect(npmEmail: string) {
  return !!npmEmail;
}
