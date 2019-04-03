import PathHelper from './path-helper';
import hash from 'object-hash';

export default class SettingsHelper {
  static checkSettingsAreCorrect(baseSlnPath: string, nuGetApiKey: string, uiPackageJsonPath: string): boolean {
    const isBaseSlnPathCorrect = PathHelper.checkBaseSlnPath(baseSlnPath);
    const isNugetApiKeySet = this.checkNuGetApiKeyIsCorrect(nuGetApiKey);
    const isCheckUiPackageJsonCorrect = PathHelper.checkUiPackageJsonPath(uiPackageJsonPath);

    return isBaseSlnPathCorrect && isNugetApiKeySet && isCheckUiPackageJsonCorrect;
  }

  static getSettingsHash(baseSlnPath: string, nuGetApiKey: string, uiPackageJsonPath: string): string {
    return hash({
      baseSlnPath,
      uiPackageJsonPath,
      nuGetApiKey
    });
  }

  static checkNuGetApiKeyIsCorrect(nuGetApiKey: string) {
    return !!nuGetApiKey;
  }
}
