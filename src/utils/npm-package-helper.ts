import fs from 'fs';
import PathHelper from './path-helper';

export default class NpmPackageHelper {
  static getLocalPackageVersion(iszoleaUiDir: string): string | undefined {
    const packageJsonPath = PathHelper.getUiPackageJsonPath(iszoleaUiDir);
    const content = fs.readFileSync(packageJsonPath).toString();
    const parseResult = JSON.parse(content);

    if (parseResult && parseResult.version) {
      return parseResult.version;
    }

    return undefined;
  }
}
