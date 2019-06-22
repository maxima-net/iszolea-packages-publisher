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

export function checkBaseSlnPath(slnPath: string): boolean {
  return !!slnPath && fs.existsSync(path.join(slnPath, Constants.BaseSlnFileName));
}

export function checkUiPackageJsonPath(iszoleaUiDir: string): boolean {
  return !!iszoleaUiDir && fs.existsSync(getUiPackageJsonPath(iszoleaUiDir));
}

export function getPackagesSets(slnPath: string, iszoleaUiDir: string): PackageSet[] {
  const result: PackageSet[] = [];

  let index = 1;
  for (const enumItem in NuGetPackages) {
    const packageSet = NuGetPackages[enumItem];
    const csProjPath = getProjectFilePath(slnPath, packageSet[0]);

    if (fs.existsSync(csProjPath)) {
      const projectsInfo: ProjectInfo[] = packageSet.map((p) => ({
        name: p,
        dir: getProjectDir(slnPath, p)
      }));

      result.push({
        id: index++,
        projectsInfo,
        isNuget: true
      });
    }
  }

  if (checkUiPackageJsonPath(iszoleaUiDir)) {
    result.push({
      id: index++,
      projectsInfo: [{
        name: Constants.IszoleaUIPackageName,
        dir: getUiPackageDir(iszoleaUiDir)
      }] as ProjectInfo[],
      isNuget: false
    });
  }

  return result;
}

export function getUiPackageJsonPath(iszoleaUiDir: string): string {
  return path.join(iszoleaUiDir, Constants.PackageJson);
}

export function getProjectFilePath(slnPath: string, packageName: string): string {
  return path.join(slnPath, packageName, `${packageName}.csproj`);
}

export function getNupkgFilePath(slnPath: string, packageName: string, version: string): string {
  const dirName = getProjectDir(slnPath, packageName);
  return path.join(dirName, 'bin', 'Release', `${packageName}.${version}.nupkg`);
}

function getProjectDir(slnPath: string, packageName: string): string {
  return path.dirname(getProjectFilePath(slnPath, packageName));
}

function getUiPackageDir(iszoleaUiDir: string): string {
  return path.dirname(getUiPackageJsonPath(iszoleaUiDir));
}
