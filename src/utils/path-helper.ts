import fs from 'fs';
import path from 'path';

const Constants = {
  BaseSlnFileName: 'ISOZ.sln',
  PackageJson: 'package.json'
}

const NuGetPackages: { [key: string]: string[] } = {
  IsozBusinessAndCore: ['ISOZ.Business', 'ISOZ.Core'],
  IsozClaims: ['ISOZ.Claims'],
  IsozMessaging: ['ISOZ.Messaging'],
  IsozSyncServiceCommon: ['ISOZ.SyncServiceCommon']
}

export interface PackageSet {
  id: number;
  names: string[];
  isNuget: boolean;
}

export default class PathHelper {
  static checkBaseSlnPath(slnPath: string): boolean {
    return !!slnPath && fs.existsSync(path.join(slnPath, Constants.BaseSlnFileName));
  }

  static checkUiPackageJsonPath(iszoleaUiDir: string): boolean {
    return !!iszoleaUiDir && fs.existsSync(this.getUiPackageJsonPath(iszoleaUiDir));
  }

  static getPackagesSets(slnPath: string, iszoleaUiDir: string): PackageSet[] {
    const result: PackageSet[] = [];

    let index = 1;
    for (const enumItem in NuGetPackages) {
      const packageSet = NuGetPackages[enumItem];
      const csProjPath = PathHelper.getProjectFilePath(slnPath, packageSet[0]);

      if (fs.existsSync(csProjPath)) {
        result.push({
          id: index++,
          names: packageSet,
          isNuget: true
        });
      }
    }

    const UiPackageSet = 'Iszolea UI';
    if (this.checkUiPackageJsonPath(iszoleaUiDir)) {
      result.push({
        id: index++,
        names: [UiPackageSet],
        isNuget: false
      });
    }

    return result;
  }

  static getUiPackageJsonPath(iszoleaUiDir: string): string {
    return path.join(iszoleaUiDir, Constants.PackageJson);
  }

  static getUiPackageDir(iszoleaUiDir: string): string {
    return path.dirname(this.getUiPackageJsonPath(iszoleaUiDir));
  }

  static getProjectFilePath(slnPath: string, packageName: string): string {
    return path.join(slnPath, packageName, `${packageName}.csproj`);
  }

  static getProjectDir(slnPath: string, packageName: string): string {
    return path.dirname(this.getProjectFilePath(slnPath, packageName));
  }

  static getNupkgFilePath(slnPath: string, packageName: string, version: string): string {
    const dirName = this.getProjectDir(slnPath, packageName);
    return path.join(dirName, 'bin', 'Release', `${packageName}.${version}.nupkg`);
  }
}
