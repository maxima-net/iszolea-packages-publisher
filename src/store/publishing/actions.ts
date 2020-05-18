import { PublishingOptions } from '../../publishing-strategies/publishing-options';
import { getPackagesSets } from '../../utils/path';
import { 
  InitializePublishingAction, UpdateGitInfoAction, ApplyNewVersionAction, 
  PublishingGlobalStage, PublishingAction, ApplyVersionProviderAction 
} from './types';
import { AppState, PublishingInfo, ThunkAction } from '../types';
import PackageSet from '../../packages/package-set';
import PublishingStrategy from '../../publishing-strategies/publishing-strategy';
import IszoleaVersionValidator from '../../version/iszolea-version-validator';
import { GitService } from '../../utils/git-service';
import { replace } from 'connected-react-router';
import routes from '../../routes';
import { fetchPackageVersions } from '../published-packages/actions';
import { VersionProviderFactory, VersionProvider } from '../../version/version-providers';

export const initializePublishing = (): ThunkAction<InitializePublishingAction> => {
  return (dispatch, getState) => {
    const state = getState();
    const availablePackages = getPackagesSets(state.settings);

    const prevSelectedPackage = getState().publishing.selectedPackageSet;
    dispatch({ type: 'INITIALIZE_PUBLISHING', payload: availablePackages });

    const selectedPackage = prevSelectedPackage && availablePackages.find((p) => {
      return p.projectsInfo.length === prevSelectedPackage.projectsInfo.length 
        && p.projectsInfo.every((pi, index) => pi.name === prevSelectedPackage.projectsInfo[index].name);
    }); 

    if (selectedPackage) {
      dispatch(selectProject(selectedPackage));
    }

    dispatch(fetchPackageVersions(true));
  };
};

export const selectProject = (packageSet: PackageSet, checkGitRepository = true): ThunkAction<PublishingAction> => {
  return async (dispatch, getState) => {
    dispatch(applyProject(packageSet, checkGitRepository, false));

    dispatch(fetchPackageVersions(false));

    const projectDir = packageSet.projectsInfo.length ? packageSet.projectsInfo[0].dir : null;
    if (projectDir && checkGitRepository) {
      dispatch(checkGitRepositoryCore(projectDir));
    }
  };
};

export const reloadVersionProviders = (): ThunkAction<PublishingAction> => {
  return async (dispatch, getState) => {
    const state = getState();
    const { selectedPackageSet } = state.publishing;

    if (selectedPackageSet) {
      dispatch(applyProject(selectedPackageSet, false, true));
    }
  };
};

const applyProject = (packageSet: PackageSet, checkGitRepository: boolean, userPublishedVersions: boolean): ThunkAction<PublishingAction> => {
  return async (dispatch, getState) => {
    const state = getState();

    const currentVersion = getCurrentVersion(packageSet);
    const publishedVersions = userPublishedVersions ? state.publishedPackages.versions : [];
    const versionProviders = new VersionProviderFactory(currentVersion, publishedVersions).getProviders();
    const defaultVersionProvider = getSelectedVersionProvider(versionProviders);
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
        versionProviders,
        versionProviderName,
        isEverythingCommitted: checkGitRepository ? undefined : state.publishing.isEverythingCommitted
      }
    });
  };
};

const getSelectedVersionProvider = (versionProviders: Map<string, VersionProvider>): VersionProvider | undefined => {
  return versionProviders && versionProviders.size ? versionProviders.values().next().value : undefined;
};

const validateVersion = (currentVersion: string, newVersion: string): string | undefined => {
  const validationResult = new IszoleaVersionValidator().validate(newVersion);

  return currentVersion === newVersion
    ? 'The version must be different from the current one'
    : validationResult.packageVersionError
      ? validationResult.packageVersionError
      : undefined;
};

export const selectVersionProvider = (versionProviderName: string): ThunkAction<ApplyVersionProviderAction> => {
  return async (dispatch, getState) => {
    const state = getState();
    const publishing = state.publishing;

    const { selectedPackageSet, versionProviders } = publishing;
    const provider = versionProviders.get(versionProviderName);
    
    const newVersion = provider 
      ? provider.isCustom() 
        ? publishing.newVersion
        : provider.getNewVersionString() || '' 
      : '';

    const isCustomVersionSelection = provider ? provider.isCustom() : false;
    const currentVersion = getCurrentVersion(selectedPackageSet);
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

export const applyNewVersion = (newVersion: string): ThunkAction<ApplyNewVersionAction> => {
  return (dispatch, getState) => {
    const state = getState();
    const publishing = state.publishing;
    
    const { selectedPackageSet, versionProviders } = publishing;
    const currentVersion = getCurrentVersion(selectedPackageSet);
    const versionProviderName = publishing.versionProviderName;
    const provider = versionProviders.get(versionProviderName);

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

export const finishPublishing = (): ThunkAction => {
  return (dispatch) => {
    dispatch(updatePublishingInfo(undefined));
    dispatch(initializePublishing());
  };
};

const updatePublishingInfo = (publishingInfo: PublishingInfo | undefined): ThunkAction => {
  return (dispatch) => {
    if (publishingInfo === undefined) {
      dispatch(replace(routes.publishSetup));
    }

    dispatch({ type: 'UPDATE_PUBLISHING_INFO', payload: publishingInfo });
  };
};

export const publishPackage = (): ThunkAction => {
  return async (dispatch, getState) => {
    let publishingInfo: PublishingInfo = {
      globalStage: PublishingGlobalStage.Publishing,
      stages: new Map(),
      error: undefined
    };

    dispatch(updatePublishingInfo(publishingInfo));
    dispatch(replace(routes.publishExecuting));

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

export const rejectPublishing = (): ThunkAction<PublishingAction> => {
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

export const pushWithTags = (): ThunkAction<PublishingAction> => {
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

export const checkGitRepository = (): ThunkAction<UpdateGitInfoAction> => {
  return async (dispatch, getState) => {
    const state = getState();
    const packageSet = state.publishing.selectedPackageSet;
    const projectDir = packageSet && packageSet.projectsInfo && packageSet.projectsInfo[0].dir;

    if (projectDir) {
      dispatch(checkGitRepositoryCore(projectDir));
    }
  };
};

const checkGitRepositoryCore = (projectDir: string): ThunkAction<UpdateGitInfoAction> => {
  return async (dispatch, getState) => {
    const gitService = new GitService(projectDir);
    const isEverythingCommitted = await gitService.isEverythingCommitted();
    const branchName = await gitService.getCurrentBranchName();

    const prevState = getState().publishing;
  
    if(prevState.branchName !== branchName || prevState.isEverythingCommitted !== isEverythingCommitted) {
      dispatch(updateGitInfo(isEverythingCommitted, branchName));

      if (prevState.selectedPackageSet) {
        dispatch(selectProject(prevState.selectedPackageSet, false));
      }
    }
  };
};

const updateGitInfo = (isCommitted: boolean, branchName: string | undefined): UpdateGitInfoAction => {
  return { type: 'UPDATE_GIT_INFO', payload: { isCommitted, branchName } };
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
