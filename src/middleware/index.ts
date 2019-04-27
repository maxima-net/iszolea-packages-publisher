import { PackageSet } from '../utils/path-helper';
import { AnyAction } from '../actions/types';
import { AppState } from '../reducers/types';
import DotNetProjectHelper from '../utils/dotnet-project-helper';
import NpmPackageHelper from '../utils/npm-package-helper';
import { VersionProvider, VersionProviderFactory } from '../version-providers';

export interface Dispatcher {
  dispatch: (action: AnyAction) => void;
}

export function getCurrentVersion(packageSet: PackageSet, state: AppState): string {
  if (!packageSet)
    return ''

  if (packageSet.isNuget) {
    const packageName = packageSet.projectsInfo[0].name;
    return packageName !== '' ? DotNetProjectHelper.getLocalPackageVersion(state.settings.baseSlnPath, packageName) || '' : '';
  } else {
    return NpmPackageHelper.getLocalPackageVersion(state.settings.uiPackageJsonPath) || '';
  }
}

export function getVersionProviders(currentVersion: string): VersionProvider[] {
  return new VersionProviderFactory(currentVersion).getProviders();
}
