import fs from 'fs';
import path from 'path';
import PackageSet from '../packages/package-set';
import ProjectInfo from '../packages/project-info';
import { NugetPackageSet } from '../packages/nuget-package-set';
import { NpmPackageSet } from '../packages/npm-package-set';
import { SettingsFields } from '../store/types';
import { config } from '../config';

export function checkSlnIsExist(slnPath: string, slnFileName: string): boolean {
  return !!slnPath && !!slnFileName && fs.existsSync(path.join(slnPath, slnFileName));
}

export function checkPackageJsonIsExist(iszoleaUiDir: string): boolean {
  return !!iszoleaUiDir && fs.existsSync(getUiPackageJsonPath(iszoleaUiDir));
}

export function getPackagesSets(settingsFields: SettingsFields): PackageSet[] {
  const result: PackageSet[] = [];

  for (const key in config.nuget.solutions) {
    const solution = config.nuget.solutions[key];
    const settings = settingsFields.solutions[key];

    if (settings.isIncluded) {
      for (const packageKey in solution.packages) {
        const packageInfo = solution.packages[packageKey];
        const csProjPath = getProjectFilePath(settings.slnPath, packageInfo.projectNames[0]);

        if (fs.existsSync(csProjPath)) {
          const projectsInfo: ProjectInfo[] = packageInfo.projectNames.map((p) => ({
            name: getPackageName(p),
            dir: getProjectDir(settings.slnPath, p),
            csprojFilePath: getProjectFilePath(settings.slnPath, p)
          }));

          result.push(new NugetPackageSet(projectsInfo, settings.slnPath));
        }
      }
    }
  }

  for (const key in config.npm.packages) {
    const packageInfo = config.npm.packages[key];
    const settings = settingsFields.npm[key];

    if (settings.isIncluded && checkPackageJsonIsExist(settings.packageJsonPath)) {
      const projectsInfo: ProjectInfo[] = [{
        name: packageInfo.packageName,
        dir: getUiPackageDir(settings.packageJsonPath),
        csprojFilePath: ''
      }];
      result.push(new NpmPackageSet(projectsInfo, settings.packageJsonPath));
    }
  }

  result.sort((a, b) => a.projectsInfo[0].name.localeCompare(b.projectsInfo[0].name));

  return result;
}

export function getUiPackageJsonPath(iszoleaUiDir: string): string {
  return path.join(iszoleaUiDir, 'package.json');
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
  return parts[parts.length - 1];
}

function getProjectFilePath(slnPath: string, packageName: string): string {
  return path.join(slnPath, packageName, `${getPackageName(packageName)}.csproj`);
}