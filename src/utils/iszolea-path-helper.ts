import fs from 'fs';
import path from 'path';

enum Constants {
  BaseSlnFileName = 'ISOZ.sln'
}

enum IsozNuGetPackages {
  IsozBusiness = 'ISOZ.Business',
  IsozClaims = 'ISOZ.Claims',
  IsozCore = 'ISOZ.Core',
  IsozMessaging = 'ISOZ.Messaging',
  IsozSyncServiceCommon = 'ISOZ.SyncServiceCommon'
}

export default class IszoleaPathHelper {
  static checkBaseSlnPath(slnPath: string): boolean {
    return !!slnPath && fs.existsSync(path.join(slnPath, Constants.BaseSlnFileName));
  }

  static getIszoleaProjectNames(slnPath: string): string[] {
    const result: string[] = [];

    for (const enumItem in IsozNuGetPackages) {
      const packageName = IsozNuGetPackages[enumItem];
      const csProjPath = IszoleaPathHelper.getProjectFilePath(slnPath, packageName);

      if (fs.existsSync(csProjPath)) {
        result.push(packageName);
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
    return path.join(dirName, 'bin', 'Release', `packageName.${version}.nupkg`);
  }
}
