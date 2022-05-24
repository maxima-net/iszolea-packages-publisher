import { checkBaseSlnPath, checkUiPackageJsonPath, checkBomCommonSlnPath, checkSmpCommonSlnPath, checkSpace3CommonSlnPath, checkReportsPortalSlnPath } from './path';
import { SettingsValidationResult, SettingsFields } from '../store/types';

export function validateSettings(settings: SettingsFields): SettingsValidationResult {
  const { isIszoleaPackagesIncluded, baseSlnPath, isIszoleaUiPackageIncluded, uiPackageJsonPath,
    isBomCommonPackageIncluded, bomCommonPackageSlnPath, isSpace3CommonPackageIncluded, space3CommonPackageSlnPath,
    isReportsPortalPackageIncluded, reportsPortalPackageSlnPath,
    isSmpCommonPackageIncluded, smpCommonPackageSlnPath,
    nuGetApiKey, npmAutoLogin, npmLogin, npmPassword, npmEmail } = settings;

  const isBaseSlnPathValid = !isIszoleaPackagesIncluded || checkBaseSlnPath(baseSlnPath);
  const isBomCommonPackageSlnPathValid = !isBomCommonPackageIncluded || checkBomCommonSlnPath(bomCommonPackageSlnPath);
  const isSmpCommonPackageSlnPathValid = !isSmpCommonPackageIncluded || checkSmpCommonSlnPath(smpCommonPackageSlnPath);
  const isSpace3CommonPackageSlnPathValid = !isSpace3CommonPackageIncluded || checkSpace3CommonSlnPath(space3CommonPackageSlnPath);
  const isReportsPortalPackageSlnPathValid = !isReportsPortalPackageIncluded || checkReportsPortalSlnPath(reportsPortalPackageSlnPath);
  const isNuGetApiKeyValid = (!isIszoleaPackagesIncluded && !isBomCommonPackageIncluded) || checkNuGetApiKeyIsCorrect(nuGetApiKey);
  const isUiPackageJsonPathValid = !isIszoleaUiPackageIncluded || checkUiPackageJsonPath(uiPackageJsonPath);
  const isNpmLoginValid = checkNpmLoginIsCorrect(npmLogin);
  const isNpmPasswordValid = checkNpmPasswordIsCorrect(npmPassword);
  const isNpmEmailValid = checkNpmEmailIsCorrect(npmEmail);

  const atLeastOneOptionIsSelected = isIszoleaPackagesIncluded || isBomCommonPackageIncluded || isIszoleaUiPackageIncluded;
  const areNpmSettingsAreValid = !isIszoleaUiPackageIncluded || !npmAutoLogin || (isNpmLoginValid && isNpmPasswordValid && isNpmEmailValid);
  const areSettingsValid = isBaseSlnPathValid && isBomCommonPackageSlnPathValid && isSmpCommonPackageSlnPathValid && isSpace3CommonPackageSlnPathValid
    && isReportsPortalPackageSlnPathValid && isNuGetApiKeyValid && isUiPackageJsonPathValid && areNpmSettingsAreValid && atLeastOneOptionIsSelected;
  
  const mainError = !areSettingsValid 
    ? !atLeastOneOptionIsSelected 
      ? 'Chose at least one option, please'
      : 'Some required settings are not provided or incorrect' 
    : undefined;

  return {
    isBaseSlnPathValid,
    isBomCommonPackageSlnPathValid,
    isSmpCommonPackageSlnPathValid,
    isSpace3CommonPackageSlnPathValid,
    isReportsPortalPackageSlnPathValid,
    isNuGetApiKeyValid,
    isUiPackageJsonPathValid,
    isNpmLoginValid,
    isNpmPasswordValid,
    isNpmEmailValid,
    mainError
  };
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
