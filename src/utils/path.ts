import fs from 'fs';
import path from 'path';
import PackageSet from '../packages/package-set';
import ProjectInfo from '../packages/project-info';
import { NugetPackageSet } from '../packages/nuget-package-set';
import { NpmPackageSet } from '../packages/npm-package-set';
import { SettingsFields } from '../store/types';
import config from '../config.json';

export const Constants = {
  BaseSlnFileName: 'ISOZ.sln',
  BomCommonSlnFileName: 'BomCommon.sln',
  SmpCommonSlnFileName: 'SMP.sln',
  Space3CommonSlnFileName: 'Space3.sln',
  ReportsPortalSlnFileName: 'ReportsPortal.sln',
  IszoleaUIPackageName: 'iszolea-ui',
  PackageJson: 'package.json'
};

export function checkBaseSlnPath(slnPath: string): boolean {
  return !!slnPath && fs.existsSync(path.join(slnPath, Constants.BaseSlnFileName));
}

export function checkBomCommonSlnPath(slnPath: string): boolean {
  return !!slnPath && fs.existsSync(path.join(slnPath, Constants.BomCommonSlnFileName));
}

export function checkSmpCommonSlnPath(slnPath: string): boolean {
  return !!slnPath && fs.existsSync(path.join(slnPath, Constants.SmpCommonSlnFileName));
}

export function checkSpace3CommonSlnPath(slnPath: string): boolean {
  return !!slnPath && fs.existsSync(path.join(slnPath, Constants.Space3CommonSlnFileName));
}

export function checkReportsPortalSlnPath(slnPath: string): boolean {
  return !!slnPath && fs.existsSync(path.join(slnPath, Constants.ReportsPortalSlnFileName));
}

export function checkUiPackageJsonPath(iszoleaUiDir: string): boolean {
  return !!iszoleaUiDir && fs.existsSync(getUiPackageJsonPath(iszoleaUiDir));
}

export function getPackagesSets(settings: SettingsFields): PackageSet[] {
  const result: PackageSet[] = [];

  if (settings.isIszoleaPackagesIncluded) {
    result.push(...getPackageSets(config.Packages.IsozBase, settings.baseSlnPath));
  }
  
  if (settings.isSmpCommonPackageIncluded) {
    result.push(...getPackageSets(config.Packages.Smp, settings.smpCommonPackageSlnPath));
  }

  if (settings.isBomCommonPackageIncluded) {
    result.push(...getPackageSets(config.Packages.BomCommon, settings.bomCommonPackageSlnPath));
  }

  if (settings.isSpace3CommonPackageIncluded) {
    result.push(...getPackageSets(config.Packages.Space3Common, settings.space3CommonPackageSlnPath));
  }

  if (settings.isReportsPortalPackageIncluded) {
    result.push(...getPackageSets(config.Packages.ReportsPortal, settings.reportsPortalPackageSlnPath));
  }

  if (settings.isIszoleaUiPackageIncluded && checkUiPackageJsonPath(settings.uiPackageJsonPath)) {
    const projectsInfo: ProjectInfo[] = [{
      name: Constants.IszoleaUIPackageName,
      dir: getUiPackageDir(settings.uiPackageJsonPath),
      csprojFilePath: ''
    }];
    result.push(new NpmPackageSet(projectsInfo, settings.uiPackageJsonPath));
  }

  result.sort((a, b) => a.projectsInfo[0].name.localeCompare(b.projectsInfo[0].name));

  return result;
}

const getPackageSets = (configSection: { [key: string]: string[] }, slnPath: string): NugetPackageSet[] => {
  const result = [];
  for (const enumItem in configSection) {
    const packageSet = configSection[enumItem];
    const csProjPath = getProjectFilePath(slnPath, packageSet[0]);

    if (fs.existsSync(csProjPath)) {
      const projectsInfo: ProjectInfo[] = packageSet.map((p) => ({
        name: getPackageName(p),
        dir: getProjectDir(slnPath, p),
        csprojFilePath: getProjectFilePath(slnPath, p)
      }));

      result.push(new NugetPackageSet(projectsInfo, slnPath));
    }
  }
  return result;
};

export function getUiPackageJsonPath(iszoleaUiDir: string): string {
  return path.join(iszoleaUiDir, Constants.PackageJson);
}

export function getNupkgFilePath(packageDir: string, packageName: string, version: string): string {
  return path.join(packageDir, 'bin', 'Release', `${getPackageName(packageName)}.${version}.nupkg`);
}

function getProjectDir(slnPath: string, packageName: string): string {
  return path.dirname(getProjectFilePath(slnPath, packageName));
}

function getUiPackageDir(iszoleaUiDir: string): string {
  return path.dirname(getUiPackageJsonPath(iszoleaUiDir));
}

function getPackageName(packagePath: string): string {
  const parts = packagePath.split('/');
  return parts[parts.length-1];
}

function getProjectFilePath(slnPath: string, packageName: string): string {
  return path.join(slnPath, packageName, `${getPackageName(packageName)}.csproj`);
}