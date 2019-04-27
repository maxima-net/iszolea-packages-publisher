import { Settings, SettingsFields, UpdateStatus, PublishingInfo, AppState } from '../reducers/types';
import * as Action from './types';
import ConfigHelper from '../utils/config-helper';
import SettingsHelper from '../utils/settings-helper';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { PublishingOptions, PublishingStrategy, PublishingStrategyFactory } from '../publishing-strategies';
import { PackageSet } from '../utils/path-helper';
import GitHelper from '../utils/git-helper';

enum SettingsKeys {
  BaseSlnPath = 'baseSlnPath',
  NuGetApiKey = 'nuGetApiKey',
  UiPackageJsonPath = 'uiPackageJsonPath',
  NpmAutoLogin = 'npmAutoLogin',
  NpmLogin = 'npmLogin',
  NpmPassword = 'npmPassword',
  NpmEmail = 'npmEmail'
}

export function changeUpdateStatus(updateStatus: UpdateStatus): Action.ChangeUpdateStatusAction {
  return { type: 'CHANGE_UPDATE_STATUS', payload: updateStatus }
}

export function loadSettings(): Action.ApplySettingsAction {
  const baseSlnPath = ConfigHelper.Get<string>(SettingsKeys.BaseSlnPath);
  const nuGetApiKey = SettingsHelper.decrypt(ConfigHelper.Get<string>(SettingsKeys.NuGetApiKey));
  const uiPackageJsonPath = ConfigHelper.Get<string>(SettingsKeys.UiPackageJsonPath);
  const npmAutoLogin = ConfigHelper.Get<boolean>(SettingsKeys.NpmAutoLogin, false);
  const npmLogin = ConfigHelper.Get<string>(SettingsKeys.NpmLogin);
  const npmPassword = SettingsHelper.decrypt(ConfigHelper.Get<string>(SettingsKeys.NpmPassword));
  const npmEmail = ConfigHelper.Get<string>(SettingsKeys.NpmEmail);

  return {
    type: 'APPLY_SETTINGS',
    payload: {
      baseSlnPath, nuGetApiKey, uiPackageJsonPath,
      npmAutoLogin, npmLogin, npmPassword, npmEmail
    }
  };
}

export function applySettings(payload: SettingsFields): Action.ApplySettingsAction {
  ConfigHelper.Set(SettingsKeys.BaseSlnPath, payload.baseSlnPath || '');
  ConfigHelper.Set(SettingsKeys.NuGetApiKey, SettingsHelper.encrypt(payload.nuGetApiKey || ''));
  ConfigHelper.Set(SettingsKeys.UiPackageJsonPath, payload.uiPackageJsonPath || '');
  ConfigHelper.Set(SettingsKeys.NpmAutoLogin, payload.npmAutoLogin || '');
  ConfigHelper.Set(SettingsKeys.NpmLogin, payload.npmLogin || '');
  ConfigHelper.Set(SettingsKeys.NpmPassword, SettingsHelper.encrypt(payload.npmPassword || ''));
  ConfigHelper.Set(SettingsKeys.NpmEmail, payload.npmEmail || '');

  return { type: 'APPLY_SETTINGS', payload: payload };
}

export function cancelSettings(): Action.CancelSettingsAction {
  return { type: 'CANCEL_SETTINGS' };
}

export function rejectSettings(payload: Settings): Action.RejectSettingsAction {
  return { type: 'REJECT_SETTINGS', payload };
}

export function switchSettingsView(value: boolean): Action.SwitchSettingsViewAction {
  return { type: 'SWITCH_SETTINGS_VIEW', payload: value }
}

export function initializePublishing(): Action.InitializePublishingAction {
  return { type: 'INITIALIZE_PUBLISHING' }
}

export function updateGitStatus(isCommitted: boolean): Action.UpdateGitStatusAction {
  return { type: 'UPDATE_GIT_STATUS', payload: isCommitted };
}

export function selectProject(packageSetId: number): Action.SelectProjectAction {
  return { type: 'SELECT_PROJECT', payload: packageSetId };
}

export function applyProject(packageSetId: number, newVersion: string,
  versionProviderName: string, isCustomVersionSelection: boolean,
  isEverythingCommitted: boolean | undefined): Action.ApplyProjectAction {
  return {
    type: 'APPLY_PROJECT',
    payload: {
      packageSetId,
      newVersion,
      versionProviderName,
      isCustomVersionSelection,
      isEverythingCommitted
    }
  };
}

export function selectVersionProvider(versionProviderName: string): Action.SelectVersionProviderAction {
  return { type: 'SELECT_VERSION_PROVIDER', payload: versionProviderName };
}

export function applyVersionProvider(versionProviderName: string, newVersion: string,
  isCustomVersionSelection: boolean): Action.ApplyVersionProviderAction {
  return {
    type: 'APPLY_VERSION_PROVIDER',
    payload: {
      versionProviderName,
      newVersion,
      isCustomVersionSelection,
    }
  }
}

export function applyNewVersion(newVersion: string): Action.ApplyNewVersionAction {
  return { type: 'APPLY_NEW_VERSION', payload: newVersion }
}

export function updatePublishingInfo(publishingInfo: PublishingInfo | undefined): Action.UpdatePublishingInfoAction {
  return { type: 'UPDATE_PUBLISHING_INFO', payload: publishingInfo };
}

export const publishPackage = (): ThunkAction<Promise<void>, AppState, any, AnyAction> => {
  return async (dispatch: ThunkDispatch<any, any, Action.AnyAction>, getState): Promise<void> => {
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
  return async (dispatch: ThunkDispatch<any, any, Action.AnyAction>, getState): Promise<void> => {
    const state = getState();

    if (!state.publishingInfo) {
      return;
    }

    const strategy = getPublishingStrategy(state, (info) => dispatch(updatePublishingInfo(info)));
    await strategy.rejectPublishing(state.publishingInfo);
  }
}

export const checkGitRepository = (): ThunkAction<Promise<void>, AppState, any, AnyAction> => {
  return async (dispatch: ThunkDispatch<any, any, Action.AnyAction>, getState): Promise<void> => {
    const state = getState();

    const packageSet = state.availablePackages.filter(p => p.id === state.packageSetId)[0];
    const projectDir = packageSet && packageSet.projectsInfo && packageSet.projectsInfo[0].dir;

    if (projectDir) {
      const isEverythingCommitted = await GitHelper.isEverythingCommitted(projectDir);
      dispatch(updateGitStatus(isEverythingCommitted));
    }
  }
}


function getPublishingStrategy(state: AppState, 
  onPublishingInfoChange: (publishingInfo: PublishingInfo) => void
  ): PublishingStrategy {
  const packageSet = state.availablePackages.filter(p => p.id === state.packageSetId)[0];
  const options: PublishingOptions = {
    newVersion: state.newVersion,
    settings: state.settings,
    packageSet,
    onPublishingInfoChange
  }

  return new PublishingStrategyFactory().getStrategy(options);
}
