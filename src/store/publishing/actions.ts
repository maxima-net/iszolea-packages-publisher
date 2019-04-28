import * as Action from '../types';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import GitHelper from '../../utils/git-helper';
import { PublishingStrategy, PublishingOptions, PublishingStrategyFactory } from '../../publishing-strategies';
import { PackageSet } from '../../utils/path-helper';
import DotNetProjectHelper from '../../utils/dotnet-project-helper';
import NpmPackageHelper from '../../utils/npm-package-helper';
import { VersionProvider, VersionProviderFactory } from '../../version-providers';
import { InitializePublishingAction, UpdateGitStatusAction, ApplyNewVersionAction, UpdatePublishingInfoAction } from './types';

export function initializePublishing(): InitializePublishingAction {
  return { type: 'INITIALIZE_PUBLISHING' }
}

export function updateGitStatus(isCommitted: boolean): UpdateGitStatusAction {
  return { type: 'UPDATE_GIT_STATUS', payload: isCommitted };
}

export const selectProject = (packageSetId: number): ThunkAction<Promise<void>, Action.AppState, any, Action.AnyAction> => {
  return async (dispatch: ThunkDispatch<any, any, Action.AnyAction>, getState): Promise<void> => {
    const state = getState();

    const projectSet = state.publishing.availablePackages.filter(p => p.id === packageSetId)[0];
    const current = getCurrentVersion(projectSet, state);
    const versionProviders = getVersionProviders(current).filter(p => p.canGenerateNewVersion());
    const defaultVersionProvider = versionProviders && versionProviders.length ? versionProviders[0] : undefined;
    const versionProviderName = defaultVersionProvider ? defaultVersionProvider.getName() : '';
    const newVersion = defaultVersionProvider ? defaultVersionProvider.getNewVersionString() || '' : '';
    const isCustomVersionSelection = defaultVersionProvider ? defaultVersionProvider.isCustom() : false;

    dispatch({
      type: 'APPLY_PROJECT',
      payload: {
        packageSetId,
        newVersion,
        versionProviderName,
        isCustomVersionSelection,
        isEverythingCommitted: undefined
      }
    });
  }
}

export const selectVersionProvider = (versionProviderName: string): ThunkAction<Promise<void>, Action.AppState, any, Action.AnyAction> => {
  return async (dispatch: ThunkDispatch<any, any, Action.AnyAction>, getState): Promise<void> => {
    const state = getState();
    const publishing = state.publishing;

    const packageSet = publishing.availablePackages.filter(p => p.id === publishing.packageSetId)[0];
    const currentVersion = getCurrentVersion(packageSet, state);
    const provider = getVersionProviders(currentVersion).find((p) => p.getName() === versionProviderName);
    const newVersion = provider ? provider.getNewVersionString() || '' : '';
    const isCustomVersionSelection = provider ? provider.isCustom() : false;

    dispatch({
      type: 'APPLY_VERSION_PROVIDER',
      payload: {
        versionProviderName,
        newVersion,
        isCustomVersionSelection,
      }
    });
  };
}

export function applyNewVersion(newVersion: string): ApplyNewVersionAction {
  return { type: 'APPLY_NEW_VERSION', payload: newVersion }
}

export function updatePublishingInfo(publishingInfo: Action.PublishingInfo | undefined): UpdatePublishingInfoAction {
  return { type: 'UPDATE_PUBLISHING_INFO', payload: publishingInfo };
}

export const publishPackage = (): ThunkAction<Promise<void>, Action.AppState, any, Action.AnyAction> => {
  return async (dispatch: ThunkDispatch<any, any, Action.AnyAction>, getState): Promise<void> => {
    let publishingInfo: Action.PublishingInfo = {
      isExecuting: true
    };

    dispatch(updatePublishingInfo(publishingInfo));
    const state = getState();
    const strategy = getPublishingStrategy(state, (info) => dispatch(updatePublishingInfo(info)));
    publishingInfo = await strategy.publish(publishingInfo);

    if (!publishingInfo.isExecuting) {
      return;
    }

    publishingInfo = {
      ...publishingInfo,
      isRejectAllowed: true,
      isExecuting: false
    }
    dispatch(updatePublishingInfo(publishingInfo));
  }
}

export const rejectPublishing = (): ThunkAction<Promise<void>, Action.AppState, any, Action.AnyAction> => {
  return async (dispatch: ThunkDispatch<any, any, Action.AnyAction>, getState): Promise<void> => {
    const state = getState();
    const publishing = state.publishing;

    if (!publishing.publishingInfo) {
      return;
    }

    const strategy = getPublishingStrategy(state, (info) => dispatch(updatePublishingInfo(info)));
    await strategy.rejectPublishing(publishing.publishingInfo);
  }
}

export const checkGitRepository = (): ThunkAction<Promise<void>, Action.AppState, any, Action.AnyAction> => {
  return async (dispatch: ThunkDispatch<any, any, Action.AnyAction>, getState): Promise<void> => {
    const state = getState();
    const publishing = state.publishing;
    const packageSet = publishing.availablePackages.filter(p => p.id === publishing.packageSetId)[0];
    const projectDir = packageSet && packageSet.projectsInfo && packageSet.projectsInfo[0].dir;

    if (projectDir) {
      const isEverythingCommitted = await GitHelper.isEverythingCommitted(projectDir);
      dispatch(updateGitStatus(isEverythingCommitted));
    }
  }
}

function getPublishingStrategy(state: Action.AppState, onPublishingInfoChange: (publishingInfo: Action.PublishingInfo) => void): PublishingStrategy {
  const publishing = state.publishing;
  const packageSet = publishing.availablePackages.filter(p => p.id === publishing.packageSetId)[0];
  const options: PublishingOptions = {
    newVersion: publishing.newVersion,
    settings: state.settings,
    packageSet,
    onPublishingInfoChange
  }

  return new PublishingStrategyFactory().getStrategy(options);
}

function getCurrentVersion(packageSet: PackageSet, state: Action.AppState): string {
  if (!packageSet)
    return ''

  if (packageSet.isNuget) {
    const packageName = packageSet.projectsInfo[0].name;
    return packageName !== '' ? DotNetProjectHelper.getLocalPackageVersion(state.settings.baseSlnPath, packageName) || '' : '';
  } else {
    return NpmPackageHelper.getLocalPackageVersion(state.settings.uiPackageJsonPath) || '';
  }
}

function getVersionProviders(currentVersion: string): VersionProvider[] {
  return new VersionProviderFactory(currentVersion).getProviders();
}
