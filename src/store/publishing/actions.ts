import { ThunkAction } from 'redux-thunk';
import { PublishingOptions } from '../../publishing-strategies/publishing-options';
import { getPackagesSets } from '../../utils/path';
import { VersionProvider, VersionProviderFactory } from '../../version-providers';
import { 
  InitializePublishingAction, UpdateGitInfoAction, ApplyNewVersionAction, 
  UpdatePublishingInfoAction, PublishingGlobalStage, PublishingAction, ApplyVersionProviderAction 
} from './types';
import { AppState, PublishingInfo } from '../types';
import PackageSet from '../../packages/package-set';
import PublishingStrategy from '../../publishing-strategies/publishing-strategy';
import IszoleaVersionValidator from '../../version/iszolea-version-validator';
import { GitService } from '../../utils/git-service';

export const initializePublishing = (): ThunkAction<void, AppState, any, InitializePublishingAction> => {
  return (dispatch, getState) => {
    const state = getState();
    const availablePackages = getPackagesSets(state.settings);
    dispatch({ type: 'INITIALIZE_PUBLISHING', payload: availablePackages });
  };
};

export const updateGitInfo = (isCommitted: boolean, branchName: string | undefined): UpdateGitInfoAction => {
  return { type: 'UPDATE_GIT_INFO', payload: { isCommitted, branchName } };
};

export const selectProject = (packageSet: PackageSet): ThunkAction<Promise<void>, AppState, any, PublishingAction> => {
  return async (dispatch) => {
    const currentVersion = getCurrentVersion(packageSet);
    const versionProviders = getVersionProviders(currentVersion).filter((p) => p.canGenerateNewVersion());
    const defaultVersionProvider = versionProviders && versionProviders.length ? versionProviders[0] : undefined;
    const versionProviderName = defaultVersionProvider ? defaultVersionProvider.getName() : '';
    const newVersion = defaultVersionProvider ? defaultVersionProvider.getNewVersionString() || '' : '';
    const isCustomVersionSelection = defaultVersionProvider ? defaultVersionProvider.isCustom() : false;
    const newVersionError = isCustomVersionSelection ? validateVersion(currentVersion, newVersion) : undefined;

    dispatch({
      type: 'APPLY_PROJECT',
      payload: {
        packageSet,
        newVersion,
        newVersionError,
        versionProviderName,
        isEverythingCommitted: undefined
      }
    });

    const projectDir = packageSet.projectsInfo.length ? packageSet.projectsInfo[0].dir : null;
    if (projectDir) {
      dispatch(await getGitInfoResult(projectDir));
    }
  };
};

const validateVersion = (currentVersion: string, newVersion: string): string | undefined => {
  const validationResult = new IszoleaVersionValidator().validate(newVersion);

  return currentVersion === newVersion
    ? 'The version must be different from the current one'
    : validationResult.packageVersionError
      ? validationResult.packageVersionError
      : undefined;
};

export const selectVersionProvider = (versionProviderName: string): ThunkAction<Promise<void>, AppState, any, ApplyVersionProviderAction> => {
  return async (dispatch, getState) => {
    const publishing = getState().publishing;

    const packageSet = publishing.selectedPackageSet;
    const currentVersion = getCurrentVersion(packageSet);
    const provider = getVersionProviders(currentVersion).find((p) => p.getName() === versionProviderName);
    const newVersion = provider ? provider.getNewVersionString() || '' : '';
    const isCustomVersionSelection = provider ? provider.isCustom() : false;
    const newVersionError = isCustomVersionSelection ? validateVersion(currentVersion, newVersion) : undefined;

    dispatch({
      type: 'APPLY_VERSION_PROVIDER',
      payload: {
        versionProviderName,
        newVersion,
        newVersionError
      }
    });
  };
};

export const applyNewVersion = (newVersion: string): ThunkAction<void, AppState, any, ApplyNewVersionAction> => {
  return (dispatch, getState) => {
    const publishing = getState().publishing;
    
    const packageSet = publishing.selectedPackageSet;
    const currentVersion = getCurrentVersion(packageSet);
    const versionProviderName = publishing.versionProviderName;
    const provider = getVersionProviders(currentVersion).find((p) => p.getName() === versionProviderName);

    const isCustomVersionSelection = provider ? provider.isCustom() : false;
    
    if (isCustomVersionSelection) {
      const newVersionError = validateVersion(currentVersion, newVersion);

      dispatch({
        type: 'APPLY_NEW_VERSION',
        payload: {
          newVersion,
          newVersionError
        }
      });
    }
  };
};

export const updatePublishingInfo = (publishingInfo: PublishingInfo | undefined): UpdatePublishingInfoAction => {
  return { type: 'UPDATE_PUBLISHING_INFO', payload: publishingInfo };
};

export const publishPackage = (): ThunkAction<Promise<void>, AppState, any, PublishingAction> => {
  return async (dispatch, getState) => {
    let publishingInfo: PublishingInfo = {
      globalStage: PublishingGlobalStage.Publishing,
      stages: new Map()
    };

    dispatch(updatePublishingInfo(publishingInfo));
    const state = getState();
    const strategy = getPublishingStrategy(state, (info) => dispatch(updatePublishingInfo(info)));
    publishingInfo = await strategy.publish(publishingInfo);

    if (publishingInfo.globalStage !== PublishingGlobalStage.Publishing) {
      return;
    }

    publishingInfo = {
      ...publishingInfo,
      globalStage: PublishingGlobalStage.Published
    };
    dispatch(updatePublishingInfo(publishingInfo));
  };
};

export const rejectPublishing = (): ThunkAction<Promise<void>, AppState, any, PublishingAction> => {
  return async (dispatch, getState) => {
    const state = getState();
    const publishing = state.publishing;

    if (!publishing.publishingInfo) {
      return;
    }

    const strategy = getPublishingStrategy(state, (info) => dispatch(updatePublishingInfo(info)));
    await strategy.rejectPublishing(publishing.publishingInfo);
  };
};

export const pushWithTags = (): ThunkAction<Promise<void>, AppState, any, PublishingAction> => {
  return async (dispatch, getState) => {
    const state = getState();
    const publishing = state.publishing;

    if (!publishing.publishingInfo) {
      return;
    }

    let publishingInfo = {
      ...publishing.publishingInfo,
      globalStage: PublishingGlobalStage.Pushing
    };
    dispatch(updatePublishingInfo(publishingInfo));

    const strategy = getPublishingStrategy(state, (info) => dispatch(updatePublishingInfo(info)));
    publishingInfo = await strategy.gitPushWithTags(publishingInfo);

    publishingInfo = {
      ...publishingInfo,
      globalStage: publishingInfo.error ? PublishingGlobalStage.Published : PublishingGlobalStage.Pushed
    };
    dispatch(updatePublishingInfo(publishingInfo));
  };
};

export const checkGitRepository = (): ThunkAction<Promise<void>, AppState, any, UpdateGitInfoAction> => {
  return async (dispatch, getState) => {
    const state = getState();
    const publishing = state.publishing;
    const packageSet = publishing.selectedPackageSet;
    const projectDir = packageSet && packageSet.projectsInfo && packageSet.projectsInfo[0].dir;

    if (projectDir) {
      dispatch(await getGitInfoResult(projectDir));
    }
  };
};

const getGitInfoResult = async (projectDir: string): Promise<UpdateGitInfoAction> => {
  const gitService = new GitService(projectDir);
  const isEverythingCommitted = await gitService.isEverythingCommitted();
  const branchName = await gitService.getCurrentBranchName();

  return updateGitInfo(isEverythingCommitted, branchName);
};

const getPublishingStrategy = (state: AppState, onPublishingInfoChange: (publishingInfo: PublishingInfo) => void): PublishingStrategy => {
  const packageSet = state.publishing.selectedPackageSet;
  if (!packageSet) {
    throw new Error('Selected package set is not defined');
  }

  const options: PublishingOptions = {
    newVersion: state.publishing.newVersion,
    settings: state.settings,
    packageSet,
    onPublishingInfoChange
  };

  return packageSet.getStrategy(options);
};

const getCurrentVersion = (packageSet: PackageSet | undefined): string => {
  return (packageSet && packageSet.getLocalPackageVersion()) || '';
};

const getVersionProviders = (currentVersion: string): VersionProvider[] => {
  return new VersionProviderFactory(currentVersion).getProviders();
};
