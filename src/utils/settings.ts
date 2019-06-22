import { checkBaseSlnPath, checkUiPackageJsonPath } from './path';
import { SettingsValidationResult, SettingsFields } from '../store/types';

export function validateSettings(settingsFields: SettingsFields): SettingsValidationResult {
  const isBaseSlnPathValid = checkBaseSlnPath(settingsFields.baseSlnPath);
  const isNuGetApiKeyValid = checkNuGetApiKeyIsCorrect(settingsFields.nuGetApiKey);
  const isUiPackageJsonPathValid = checkUiPackageJsonPath(settingsFields.uiPackageJsonPath);
  const isNpmLoginValid = checkNpmLoginIsCorrect(settingsFields.npmLogin);
  const isNpmPasswordValid = checkNpmPasswordIsCorrect(settingsFields.npmPassword);
  const isNpmEmailValid = checkNpmEmailIsCorrect(settingsFields.npmEmail);

  return getSettingsValidationResult(settingsFields.npmAutoLogin, isBaseSlnPathValid,
    isNuGetApiKeyValid, isUiPackageJsonPathValid, isNpmLoginValid, isNpmPasswordValid, isNpmEmailValid);
}

export function getSettingsValidationResult(npmAutoLogin: boolean, isBaseSlnPathValid: boolean, isNuGetApiKeyValid: boolean,
  isUiPackageJsonPathValid: boolean, isNpmLoginValid: boolean, isNpmPasswordValid: boolean, isNpmEmailValid: boolean
): SettingsValidationResult {
  const areNpmSettingsAreValid = isNpmLoginValid && isNpmPasswordValid && isNpmEmailValid || !npmAutoLogin;
  const areSettingsValid = isBaseSlnPathValid && isNuGetApiKeyValid && isUiPackageJsonPathValid && areNpmSettingsAreValid;
  const mainError = !areSettingsValid ? 'Some required settings are not provided' : undefined;

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
