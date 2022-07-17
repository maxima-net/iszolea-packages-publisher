import { checkPackageJsonIsExist, checkSlnIsExist } from './path';
import { SettingsValidationResult, SettingsFields, SolutionValidationResults, NpmValidationResults } from '../store/types';
import { config } from '../config';

export function validateSettings(settings: SettingsFields): SettingsValidationResult {
  const {
    solutions,
    npm,
    nuGetApiKey,
    npmAutoLogin, npmLogin, npmPassword, npmEmail
  } = settings;

  const solutionValidationResults: { [key: string]: SolutionValidationResults } = {};
  for (const key in config.nuget.solutions) {
    const solutionConfig = config.nuget.solutions[key];
    const solutionFields = solutions[key];

    solutionValidationResults[key] = {
      isSlnPathValid: !solutionFields.isIncluded || checkSlnIsExist(solutionFields.slnPath, solutionConfig.slnFileName)
    };
  }

  const npmValidationResults: { [key: string]: NpmValidationResults } = {};
  for(const key in config.npm.packages) {
    const npmFileds = npm[key];

    npmValidationResults[key] = {
      isPackageJsonPathValid: !npmFileds.isIncluded || checkPackageJsonIsExist(npmFileds.packageJsonPath)
    };
  }

  const isNugetPackagesIncluded = Object.values(solutions).some((s) => s.isIncluded);
  const isNpmPackagesIncluded = Object.values(npm).some((p) => p.isIncluded);

  const isNuGetApiKeyValid = !isNugetPackagesIncluded || checkNuGetApiKeyIsCorrect(nuGetApiKey);

  const isNpmLoginValid = checkNpmLoginIsCorrect(npmLogin);
  const isNpmPasswordValid = checkNpmPasswordIsCorrect(npmPassword);
  const isNpmEmailValid = checkNpmEmailIsCorrect(npmEmail);

  const atLeastOneOptionIsSelected = isNugetPackagesIncluded || isNpmPackagesIncluded;
  const areNpmSettingsAreValid = !isNpmPackagesIncluded || !npmAutoLogin || (isNpmLoginValid && isNpmPasswordValid && isNpmEmailValid);
  
  const areSettingsValid = Object.values(solutionValidationResults).every((r) => r.isSlnPathValid) && isNuGetApiKeyValid 
    && Object.values(npmValidationResults).every((r) => r.isPackageJsonPathValid) && areNpmSettingsAreValid 
    && atLeastOneOptionIsSelected;

  const mainError = !areSettingsValid
    ? !atLeastOneOptionIsSelected
      ? 'Chose at least one option, please'
      : 'Some required settings are not provided or incorrect'
    : undefined;

  return {
    solutionValidationResults,
    npmValidationResults,
    isNuGetApiKeyValid,
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
