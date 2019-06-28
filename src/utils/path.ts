import fs from 'fs';
import path from 'path';
import PackageSet from '../packages/package-set';
import ProjectInfo from '../packages/project-info';
import { NugetPackageSet } from '../packages/nuget-package-set';
import { NpmPackageSet } from '../packages/npm-package-set';
import { SettingsFields } from '../store/types';

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


export function checkBaseSlnPath(slnPath: string): boolean {
  return !!slnPath && fs.existsSync(path.join(slnPath, Constants.BaseSlnFileName));
}

export function checkUiPackageJsonPath(iszoleaUiDir: string): boolean {
  return !!iszoleaUiDir && fs.existsSync(getUiPackageJsonPath(iszoleaUiDir));
}

export function getPackagesSets(settings: SettingsFields): PackageSet[] {
  const result: PackageSet[] = [];

  if (settings.isIszoleaPackagesIncluded) {
    for (const enumItem in NuGetPackages) {
      const packageSet = NuGetPackages[enumItem];
      const csProjPath = getProjectFilePath(settings.baseSlnPath, packageSet[0]);

      if (fs.existsSync(csProjPath)) {
        const projectsInfo: ProjectInfo[] = packageSet.map((p) => ({
          name: p,
          dir: getProjectDir(settings.baseSlnPath, p)
        }));

        result.push(new NugetPackageSet(projectsInfo, settings.baseSlnPath));
      }
    }
  }

  if (settings.isIszoleaUiPackageIncluded && checkUiPackageJsonPath(settings.uiPackageJsonPath)) {
    const projectsInfo: ProjectInfo[] = [{
      name: Constants.IszoleaUIPackageName,
      dir: getUiPackageDir(settings.uiPackageJsonPath)
    }];
    result.push(new NpmPackageSet(projectsInfo, settings.uiPackageJsonPath));
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
