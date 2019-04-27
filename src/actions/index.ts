import { Settings, SettingsFields, UpdateStatus, PublishingInfo, AppState, SettingsKeys } from '../reducers/types';
import * as Action from './types';
import ConfigHelper from '../utils/config-helper';
import SettingsHelper from '../utils/settings-helper';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { PublishingOptions, PublishingStrategy, PublishingStrategyFactory } from '../publishing-strategies';
import GitHelper from '../utils/git-helper';
import PathHelper from '../utils/path-helper';
import { getCurrentVersion, getVersionProviders } from '../middleware';

export function changeUpdateStatus(updateStatus: UpdateStatus): Action.ChangeUpdateStatusAction {
  return { type: 'CHANGE_UPDATE_STATUS', payload: updateStatus }
}

export function loadSettings(): Action.ApplySettingsAction | Action.RejectSettingsAction{
  const settingsFields = {
    baseSlnPath: ConfigHelper.Get<string>(SettingsKeys.BaseSlnPath),
    nuGetApiKey: SettingsHelper.decrypt(ConfigHelper.Get<string>(SettingsKeys.NuGetApiKey)),
    uiPackageJsonPath: ConfigHelper.Get<string>(SettingsKeys.UiPackageJsonPath),
    npmAutoLogin: ConfigHelper.Get<boolean>(SettingsKeys.NpmAutoLogin, false),
    npmLogin: ConfigHelper.Get<string>(SettingsKeys.NpmLogin),
    npmPassword: SettingsHelper.decrypt(ConfigHelper.Get<string>(SettingsKeys.NpmPassword)),
    npmEmail: ConfigHelper.Get<string>(SettingsKeys.NpmEmail)
  };

  return applySettingsCore(settingsFields)
}

export function applySettings(settingsFields: SettingsFields): Action.ApplySettingsAction | Action.RejectSettingsAction {
  ConfigHelper.Set(SettingsKeys.BaseSlnPath, settingsFields.baseSlnPath || '');
  ConfigHelper.Set(SettingsKeys.NuGetApiKey, SettingsHelper.encrypt(settingsFields.nuGetApiKey || ''));
  ConfigHelper.Set(SettingsKeys.UiPackageJsonPath, settingsFields.uiPackageJsonPath || '');
  ConfigHelper.Set(SettingsKeys.NpmAutoLogin, settingsFields.npmAutoLogin || '');
  ConfigHelper.Set(SettingsKeys.NpmLogin, settingsFields.npmLogin || '');
  ConfigHelper.Set(SettingsKeys.NpmPassword, SettingsHelper.encrypt(settingsFields.npmPassword || ''));
  ConfigHelper.Set(SettingsKeys.NpmEmail, settingsFields.npmEmail || '');

  return applySettingsCore(settingsFields);
}

function applySettingsCore(settingsFields: SettingsFields): Action.ApplySettingsAction | Action.RejectSettingsAction {
  const isBaseSlnPathValid = PathHelper.checkBaseSlnPath(settingsFields.baseSlnPath);
  const isNuGetApiKeyValid = SettingsHelper.checkNuGetApiKeyIsCorrect(settingsFields.nuGetApiKey);
  const isUiPackageJsonPathValid = PathHelper.checkUiPackageJsonPath(settingsFields.uiPackageJsonPath);
  const isNpmLoginValid = SettingsHelper.checkNpmLoginIsCorrect(settingsFields.npmLogin);
  const isNpmPasswordValid = SettingsHelper.checkNpmPasswordIsCorrect(settingsFields.npmPassword);
  const isNpmEmailValid = SettingsHelper.checkNpmEmailIsCorrect(settingsFields.npmEmail);

  const isSettingsValid = isBaseSlnPathValid && isNuGetApiKeyValid && isUiPackageJsonPathValid
    && isNpmLoginValid && isNpmPasswordValid && isNpmEmailValid;

  const mainError = !isSettingsValid ? 'Some required settings are not provided' : undefined;
  /* TODO: refactor */
  const hash = SettingsHelper.getSettingsHash(settingsFields.baseSlnPath, settingsFields.nuGetApiKey,
    settingsFields.uiPackageJsonPath, settingsFields.npmLogin, settingsFields.npmPassword, settingsFields.npmEmail);

  const settings: Settings = {
    ...settingsFields,
    hash,
    mainError,
    isBaseSlnPathValid,
    isNuGetApiKeyValid,
    isUiPackageJsonPathValid,
    isNpmLoginValid,
    isNpmPasswordValid,
    isNpmEmailValid
  }

  return isSettingsValid
    ? { type: 'APPLY_SETTINGS', payload: { settings, displaySettingsView: !isSettingsValid } }
    : { type: 'REJECT_SETTINGS', payload: settings };
}

export function cancelSettings(): Action.CancelSettingsAction {
  return { type: 'CANCEL_SETTINGS' };
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

export const selectProject = (packageSetId: number): ThunkAction<Promise<void>, AppState, any, AnyAction> => {
  return async (dispatch: ThunkDispatch<any, any, Action.AnyAction>, getState): Promise<void> => {
    const state = getState();

    const projectSet = state.availablePackages.filter(p => p.id === packageSetId)[0];
    const current = getCurrentVersion(projectSet, state);
    const versionProviders = getVersionProviders(current).filter(p => p.canGenerateNewVersion());
    const defaultVersionProvider = versionProviders && versionProviders.length ? versionProviders[0] : undefined;
    const versionProviderName = defaultVersionProvider ? defaultVersionProvider.getName() : '';
    const newVersion = defaultVersionProvider ? defaultVersionProvider.getNewVersionString() || '' : '';
    const isCustomVersionSelection = defaultVersionProvider ? defaultVersionProvider.isCustom() : false;

    dispatch(applyProject(packageSetId, newVersion, versionProviderName, isCustomVersionSelection, undefined));
  }
}

function applyProject(packageSetId: number, newVersion: string,
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

function getPublishingStrategy(state: AppState, onPublishingInfoChange: (publishingInfo: PublishingInfo) => void): PublishingStrategy {
  const packageSet = state.availablePackages.filter(p => p.id === state.packageSetId)[0];
  const options: PublishingOptions = {
    newVersion: state.newVersion,
    settings: state.settings,
    packageSet,
    onPublishingInfoChange
  }

  return new PublishingStrategyFactory().getStrategy(options);
}
