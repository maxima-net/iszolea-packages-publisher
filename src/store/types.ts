import Redux from 'redux';
import { PublishingStageInfo, PublishingStage, PublishingGlobalStage } from './publishing/types';
import { UpdateInfo } from 'electron-updater';
import PackageSet from '../packages/package-set';

export interface AppState {
  initialization: Initialization;
  settings: Settings;
  layout: Layout;
  publishing: Publishing;
}

export interface Initialization {
  isInitialized: boolean | undefined;
  isNuGetCommandAvailable: boolean | undefined;
  isDotNetCommandAvailable: boolean | undefined;
  isNpmCommandAvailable: boolean | undefined;
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

export interface SettingsValidationResult {
  mainError?: string;
  isBaseSlnPathValid: boolean;
  isNuGetApiKeyValid: boolean;
  isUiPackageJsonPathValid: boolean;
  isNpmLoginValid: boolean;
  isNpmPasswordValid: boolean;
  isNpmEmailValid: boolean;
}

export type Settings = SettingsFields & SettingsValidationResult;

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
  globalStage: PublishingGlobalStage;
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
