import Redux, { Action } from 'redux';
import { PublishingStageInfo, PublishingStage, PublishingGlobalStage } from './publishing/types';
import { UpdateInfo } from 'electron-updater';
import PackageSet from '../packages/package-set';
import { RouterState } from 'connected-react-router';
import { LocationState } from 'history';
import { ThunkAction as ReduxThunkAction } from 'redux-thunk';
import { PackageVersionInfo } from '../version/nuget-versions-parser';

export interface AppState {
  router: RouterState<LocationState>;
  initialization: Initialization;
  settings: Settings;
  layout: Layout;
  publishing: Publishing;
  publishedPackages: PublishedPackages;
}

export enum PublishedPackagesLoadStatus {
  Unloaded, Loading, Loaded
}

export interface PublishedPackages {
  status: PublishedPackagesLoadStatus;
  packageName: string;
  lastUpdated: Date | undefined;
  versions: PackageVersionInfo[];
  cache: Map<string, PackageVersionCache>;
}

export interface PackageVersionCache {
  data: PackageVersionInfo[];
  lastUpdated: Date;
}

export interface Initialization {
  isInitialized: boolean | undefined;
  isNuGetCommandAvailable: boolean | undefined;
  isDotNetCommandAvailable: boolean | undefined;
  isNpmCommandAvailable: boolean | undefined;
  isGitCommandAvailable: boolean | undefined;
}

export interface Publishing {
  availablePackages: PackageSet[];
  selectedPackageSet: PackageSet | undefined;
  versionProviderName: string;
  newVersion: string;
  newVersionError: string | undefined;
  isEverythingCommitted: boolean | undefined;
  branchName: string | undefined;
  publishingInfo: PublishingInfo | undefined;
}

export interface Layout {
  updateStatus: UpdateStatus;
  updateInfo: UpdateInfo | undefined;
}

export interface SettingsFields {
  isIszoleaPackagesIncluded: boolean;
  baseSlnPath: string;

  isBomCommonPackageIncluded: boolean;
  bomCommonPackageSlnPath: string;

  isSmpCommonPackageIncluded: boolean;
  smpCommonPackageSlnPath: string;
  
  isIszoleaUiPackageIncluded: boolean;
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
  isBomCommonPackageSlnPathValid: boolean;
  isSmpCommonPackageSlnPathValid: boolean;
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
  IsIszoleaPackagesIncluded = 'isIszoleaPackagesIncluded',
  BaseSlnPath = 'baseSlnPath',
  
  IsBomCommonPackageIncluded = 'isBomCommonPackageIncluded',
  BomCommonPackageSlnPath = 'bomCommonPackageSlnPath',

  IsSmpCommonPackageIncluded = 'isSmpCommonPackageIncluded',
  SmpCommonPackageSlnPath = 'smpCommonPackageSlnPath',

  NuGetApiKey = 'nuGetApiKey',
  
  IsIszoleaUiPackageIncluded = 'isIszoleaUiPackageIncluded',
  UiPackageJsonPath = 'uiPackageJsonPath',
  NpmAutoLogin = 'npmAutoLogin',
  NpmLogin = 'npmLogin',
  NpmPassword = 'npmPassword',
  NpmEmail = 'npmEmail'
}

export interface BaseAction extends Redux.Action<string> {
  payload?: any;
}

export type ThunkAction<A extends Action<any> = any> = ReduxThunkAction<any, AppState, any, A>;
