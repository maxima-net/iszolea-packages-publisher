import { ThunkAction } from 'redux-thunk';
import GitHelper from '../../utils/git-helper';
import { PublishingStrategy, PublishingOptions, PublishingStrategyFactory } from '../../publishing-strategies';
import PathHelper, { PackageSet } from '../../utils/path-helper';
import DotNetProjectHelper from '../../utils/dotnet-project-helper';
import NpmPackageHelper from '../../utils/npm-package-helper';
import { VersionProvider, VersionProviderFactory } from '../../version-providers';
import { InitializePublishingAction, UpdateGitStatusAction, ApplyNewVersionAction, UpdatePublishingInfoAction } from './types';
import { AppState, PublishingInfo } from '../types';
import { AnyAction } from 'redux';

export const initializePublishing = (): ThunkAction<void, AppState, any, InitializePublishingAction> => {
  return (dispatch, getState) => {
    const state = getState();
    const availablePackages = PathHelper.getPackagesSets(state.settings.baseSlnPath, state.settings.uiPackageJsonPath);
    dispatch({ type: 'INITIALIZE_PUBLISHING', payload: availablePackages });
  }
}

export const updateGitStatus = (isCommitted: boolean): UpdateGitStatusAction => {
  return { type: 'UPDATE_GIT_STATUS', payload: isCommitted };
}

export const selectProject = (packageSetId: number): ThunkAction<Promise<void>, AppState, any, AnyAction> => {
  return async (dispatch, getState) => {
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

export const selectVersionProvider = (versionProviderName: string): ThunkAction<Promise<void>, AppState, any, AnyAction> => {
  return async (dispatch, getState) => {
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
        isCustomVersionSelection
      }
    });
  };
}

export const applyNewVersion = (newVersion: string): ApplyNewVersionAction => {
  return { type: 'APPLY_NEW_VERSION', payload: newVersion };
}

export const updatePublishingInfo = (publishingInfo: PublishingInfo | undefined): UpdatePublishingInfoAction => {
  return { type: 'UPDATE_PUBLISHING_INFO', payload: publishingInfo };
}

export const publishPackage = (): ThunkAction<Promise<void>, AppState, any, AnyAction> => {
  return async (dispatch, getState) => {
    let publishingInfo: PublishingInfo = {
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

export const rejectPublishing = (): ThunkAction<Promise<void>, AppState, any, AnyAction> => {
  return async (dispatch, getState) => {
    const state = getState();
    const publishing = state.publishing;

    if (!publishing.publishingInfo) {
      return;
    }

    const strategy = getPublishingStrategy(state, (info) => dispatch(updatePublishingInfo(info)));
    await strategy.rejectPublishing(publishing.publishingInfo);
  }
}

export const checkGitRepository = (): ThunkAction<Promise<void>, AppState, any, AnyAction> => {
  return async (dispatch, getState) => {
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

const getPublishingStrategy = (state: AppState, onPublishingInfoChange: (publishingInfo: PublishingInfo) => void): PublishingStrategy => {
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

const getCurrentVersion = (packageSet: PackageSet, state: AppState): string => {
  if (!packageSet)
    return ''

  if (packageSet.isNuget) {
    const packageName = packageSet.projectsInfo[0].name;
    return packageName !== '' ? DotNetProjectHelper.getLocalPackageVersion(state.settings.baseSlnPath, packageName) || '' : '';
  } else {
    return NpmPackageHelper.getLocalPackageVersion(state.settings.uiPackageJsonPath) || '';
  }
}

const getVersionProviders = (currentVersion: string): VersionProvider[] => {
  return new VersionProviderFactory(currentVersion).getProviders();
}