import PathHelper from './path-helper';
import hash from 'object-hash';

export default class SettingsHelper {
  static checkSettingsAreCorrect(baseSlnPath: string, nuGetApiKey: string, uiPackageJsonPath: string,
    npmLogin: string, npmPassword: string, npmEmail: string
  ): boolean {
    const isBaseSlnPathCorrect = PathHelper.checkBaseSlnPath(baseSlnPath);
    const isNugetApiKeySet = this.checkNuGetApiKeyIsCorrect(nuGetApiKey);
    const isCheckUiPackageJsonCorrect = PathHelper.checkUiPackageJsonPath(uiPackageJsonPath);
    const isNpmLoginCorrect = this.checkNpmLoginIsCorrect(npmLogin);
    const isNpmPasswordCorrect = this.checkNpmPasswordIsCorrect(npmPassword);
    const isNpmEmailCorrect = this.checkNpmEmailIsCorrect(npmEmail);

    return isBaseSlnPathCorrect && isNugetApiKeySet && isCheckUiPackageJsonCorrect
      && isNpmLoginCorrect && isNpmPasswordCorrect && isNpmEmailCorrect;
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
}
