import Redux from 'redux';
import { ChangeUpdateStatusAction, SwitchSettingsViewAction } from './layout/types';
import {
  InitializePublishingAction, UpdateGitStatusAction, ApplyProjectAction,
  ApplyVersionProviderAction, ApplyNewVersionAction, UpdatePublishingInfoAction, PublishingStageInfo, PublishingStage
} from './publishing/types';
import { ApplySettingsAction } from './settings/types';
import { UpdateInfo } from 'electron-updater';
import { PackageSet } from '../utils/path-helper';

export interface AppState {
  settings: Settings;
  layout: Layout;
  publishing: Publishing;
}

export interface Publishing {
  availablePackages: PackageSet[];
  packageSetId: number | undefined;
  versionProviderName: string;
  newVersion: string;
  isCustomVersionSelection: boolean;
  isEverythingCommitted: boolean | undefined;
  publishingInfo: PublishingInfo | undefined;
}

export interface Layout {
  displaySettingsView: boolean;
  updateStatus: UpdateStatus;
  updateInfo: UpdateInfo | undefined;
}

export interface SettingsFields {
  baseSlnPath: string;
  uiPackageJsonPath: string;
  nuGetApiKey: string;
  npmAutoLogin: boolean;
  npmLogin: string;
  npmPassword: string;
  npmEmail: string;
}

export interface Settings extends SettingsFields {
  hash: string;
  mainError?: string;
  isBaseSlnPathValid: boolean;
  isNuGetApiKeyValid: boolean;
  isUiPackageJsonPathValid: boolean;
  isNpmLoginValid: boolean;
  isNpmPasswordValid: boolean;
  isNpmEmailValid: boolean;
}

export enum UpdateStatus {
  Checking,
  UpdateIsNotAvailable,
  UpdateIsAvailable,
  UpdateIsDownloading,
  UpdateIsDownloaded,
  DeclinedByUser,
  Error
}

export interface PublishingInfo {
  isRejected?: boolean;
  isRejectAllowed?: boolean;
  isExecuting: boolean;
  error?: string;
  stages: ReadonlyMap<PublishingStage, PublishingStageInfo>;
}

export enum SettingsKeys {
  BaseSlnPath = 'baseSlnPath',
  NuGetApiKey = 'nuGetApiKey',
  UiPackageJsonPath = 'uiPackageJsonPath',
  NpmAutoLogin = 'npmAutoLogin',
  NpmLogin = 'npmLogin',
  NpmPassword = 'npmPassword',
  NpmEmail = 'npmEmail'
}

export interface BaseAction extends Redux.Action<string> {
  payload?: any;
}

export type AnyAction = ApplySettingsAction | SwitchSettingsViewAction
  | ChangeUpdateStatusAction | InitializePublishingAction | UpdateGitStatusAction | ApplyProjectAction
  | ApplyVersionProviderAction | ApplyNewVersionAction | UpdatePublishingInfoAction;
