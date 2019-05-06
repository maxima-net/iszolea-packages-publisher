import PathHelper from './path-helper';
import Cryptr from 'cryptr';
import { SettingsValidationResult, SettingsFields } from '../store/types';

export default class SettingsHelper {
  private static readonly Key = 'iszolea-packages-publisher';
  static SettingsKeys: any;

  static validateSettings(settingsFields: SettingsFields): SettingsValidationResult {
    const isBaseSlnPathValid = PathHelper.checkBaseSlnPath(settingsFields.baseSlnPath);
    const isNuGetApiKeyValid = this.checkNuGetApiKeyIsCorrect(settingsFields.nuGetApiKey);
    const isUiPackageJsonPathValid = PathHelper.checkUiPackageJsonPath(settingsFields.uiPackageJsonPath);
    const isNpmLoginValid = this.checkNpmLoginIsCorrect(settingsFields.npmLogin);
    const isNpmPasswordValid = this.checkNpmPasswordIsCorrect(settingsFields.npmPassword);
    const isNpmEmailValid = this.checkNpmEmailIsCorrect(settingsFields.npmEmail);
   
    return this.getValidationResult(settingsFields.npmAutoLogin, isBaseSlnPathValid, 
      isNuGetApiKeyValid, isUiPackageJsonPathValid, isNpmLoginValid, isNpmPasswordValid, isNpmEmailValid);
  }

  static getValidationResult(npmAutoLogin: boolean, isBaseSlnPathValid: boolean,isNuGetApiKeyValid: boolean,
    isUiPackageJsonPathValid: boolean, isNpmLoginValid: boolean,isNpmPasswordValid: boolean, isNpmEmailValid: boolean
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

  static checkNuGetApiKeyIsCorrect(nuGetApiKey: string) {
    return !!nuGetApiKey;
  }

  static checkNpmLoginIsCorrect(npmLogin: string) {
    return !!npmLogin;
  }

  static checkNpmPasswordIsCorrect(npmPassword: string) {
    return !!npmPassword;
  }

  static checkNpmEmailIsCorrect(npmEmail: string) {
    return !!npmEmail;
  }

  static encrypt(value: string): string {
    const cryptr = new Cryptr(this.Key);
    return cryptr.encrypt(value);
  }

  static decrypt(value: string): string {
    try{
      const cryptr = new Cryptr(this.Key);
      return cryptr.decrypt(value);
    }
    catch {
      return '';
    }
  }
}
