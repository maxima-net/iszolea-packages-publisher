import fs from 'fs';
import path from 'path';

export const Constants = {
  BaseSlnFileName: 'ISOZ.sln',
  IszoleaUIPackageName: 'iszolea-ui',
  PackageJson: 'package.json'
}

const NuGetPackages: { [key: string]: string[] } = {
  IsozBusinessAndCore: ['ISOZ.Business', 'ISOZ.Core'],
  IsozClaims: ['ISOZ.Claims'],
  IsozMessaging: ['ISOZ.Messaging'],
  IsozSyncServiceCommon: ['ISOZ.SyncServiceCommon']
}

export interface ProjectInfo {
  name: string;
  dir: string;
}

export interface PackageSet {
  id: number;
  projectsInfo: ProjectInfo[];
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
        const projectsInfo: ProjectInfo[] = packageSet.map((p) => ({
          name: p,
          dir: PathHelper.getProjectDir(slnPath, packageSet[0])
        }));

        result.push({
          id: index++,
          projectsInfo,
          isNuget: true
        });
      }
    }

    if (this.checkUiPackageJsonPath(iszoleaUiDir)) {
      result.push({
        id: index++,
        projectsInfo: [{
          name: Constants.IszoleaUIPackageName,
          dir: PathHelper.getUiPackageDir(iszoleaUiDir)
        }] as ProjectInfo[],
        isNuget: false
      });
    }

    return result;
  }

  static getUiPackageJsonPath(iszoleaUiDir: string): string {
    return path.join(iszoleaUiDir, Constants.PackageJson);
  }

  static getProjectFilePath(slnPath: string, packageName: string): string {
    return path.join(slnPath, packageName, `${packageName}.csproj`);
  }

  static getNupkgFilePath(slnPath: string, packageName: string, version: string): string {
    const dirName = this.getProjectDir(slnPath, packageName);
    return path.join(dirName, 'bin', 'Release', `${packageName}.${version}.nupkg`);
  }

  private static getProjectDir(slnPath: string, packageName: string): string {
    return path.dirname(this.getProjectFilePath(slnPath, packageName));
  }

  private static getUiPackageDir(iszoleaUiDir: string): string {
    return path.dirname(this.getUiPackageJsonPath(iszoleaUiDir));
  }
}
