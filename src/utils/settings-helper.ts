import IszoleaPathHelper from './iszolea-path-helper';
import hash from 'object-hash';
export default class SettingsHelper {
  static checkSettingsAreCorrect(baseSlnPath: string, nuGetApiKey: string): boolean {
    const isBaseSlnPathCorrect = this.checkBaseSlnPathIsCorrect(baseSlnPath);
    const isNugetApiKeySet = this.checkNuGetApiKeyIsCorrect(nuGetApiKey);

    return isBaseSlnPathCorrect && isNugetApiKeySet;
  }

  static getSettingsHash(baseSlnPath: string, nuGetApiKey: string): string {
    return hash({
      baseSlnPath,
      nuGetApiKey
    });
  }

  static checkBaseSlnPathIsCorrect(baseSlnPath: string) {
    return IszoleaPathHelper.checkBaseSlnPath(baseSlnPath);
  }

  static checkNuGetApiKeyIsCorrect(nuGetApiKey: string) {
    return !!nuGetApiKey;
  }
}
