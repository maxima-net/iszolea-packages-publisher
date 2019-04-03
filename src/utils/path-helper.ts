import fs from 'fs';
import path from 'path';

const Constants = {
  BaseSlnFileName: 'ISOZ.sln'
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
}

export default class PathHelper {
  static checkBaseSlnPath(slnPath: string): boolean {
    return !!slnPath && fs.existsSync(path.join(slnPath, Constants.BaseSlnFileName));
  }

  static checkUiPackageJsonPath(npmFolderPath: string): boolean {
    return !!npmFolderPath && fs.existsSync(path.join(npmFolderPath, 'package.json'));
  }

  static getPackagesSets(slnPath: string): PackageSet[] {
    const result: PackageSet[] = [];

    let index = 1;
    for (const enumItem in NuGetPackages) {
      const packageSet = NuGetPackages[enumItem];
      const csProjPath = PathHelper.getProjectFilePath(slnPath, packageSet[0]);

      if (fs.existsSync(csProjPath)) {
        result.push({
          id: index++,
          names: packageSet
        });
      }
    }

    return result;
  }

  static getProjectFilePath(slnPath: string, packageName: string): string {
    return path.join(slnPath, packageName, `${packageName}.csproj`);
  }

  static getProjectDirPath(slnPath: string, packageName: string): string {
    return path.dirname(this.getProjectFilePath(slnPath, packageName));
  }

  static getNupkgFilePath(slnPath: string, packageName: string, version: string): string {
    const dirName = this.getProjectDirPath(slnPath, packageName);
    return path.join(dirName, 'bin', 'Release', `${packageName}.${version}.nupkg`);
  }
}
