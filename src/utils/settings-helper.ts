import PathHelper from './path-helper';
import hash from 'object-hash';
import Cryptr from 'cryptr';

export default class SettingsHelper {
  private static readonly Key = 'iszolea-packages-publisher';
  static SettingsKeys: any;

  static checkSettingsAreCorrect(baseSlnPath: string, nuGetApiKey: string, uiPackageJsonPath: string,
    npmAutoLogin: boolean, npmLogin: string, npmPassword: string, npmEmail: string
  ): boolean {
    const isBaseSlnPathCorrect = PathHelper.checkBaseSlnPath(baseSlnPath);
    const isNugetApiKeySet = this.checkNuGetApiKeyIsCorrect(nuGetApiKey);
    const isCheckUiPackageJsonCorrect = PathHelper.checkUiPackageJsonPath(uiPackageJsonPath);

    const isNpmLoginCorrect = this.checkNpmLoginIsCorrect(npmLogin);
    const isNpmPasswordCorrect = this.checkNpmPasswordIsCorrect(npmPassword);
    const isNpmEmailCorrect = this.checkNpmEmailIsCorrect(npmEmail);
    const npmSettingsAreCorrect = isNpmLoginCorrect && isNpmPasswordCorrect && isNpmEmailCorrect || !npmAutoLogin;

    return isBaseSlnPathCorrect && isNugetApiKeySet && isCheckUiPackageJsonCorrect && npmSettingsAreCorrect;
  }

  static getSettingsHash(baseSlnPath: string, nuGetApiKey: string, uiPackageJsonPath: string,
    npmLogin: string, npmPassword: string, npmEmail: string
  ): string {
    return hash({
      baseSlnPath,
      nuGetApiKey,
      uiPackageJsonPath,
      npmLogin,
      npmPassword,
      npmEmail
    });
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
