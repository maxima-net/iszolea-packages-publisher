import Redux, { Action } from 'redux';
import { PublishingStageInfo, PublishingStage, PublishingGlobalStage } from './publishing/types';
import { UpdateInfo } from 'electron-updater';
import PackageSet from '../packages/package-set';
import { RouterState } from 'connected-react-router';
import { LocationState } from 'history';
import { ThunkAction as ReduxThunkAction } from 'redux-thunk';
import { PackageVersionInfo } from '../version/nuget-versions-parser';
import { VersionProvider } from '../version/version-providers';

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
  versionProviders: Map<string, VersionProvider>;
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

export interface SolutionFields {
  isIncluded: boolean;
  slnPath: string;
}

export interface NpmFields {
  isIncluded: boolean;
  packageJsonPath: string;
}

export interface SettingsFields {
  solutions: { [key: string]: SolutionFields };
  npm: { [key: string]: NpmFields };

  nuGetApiKey: string;

  npmAutoLogin: boolean;
  npmLogin: string;
  npmPassword: string;
  npmEmail: string;
}

export interface SolutionValidationResults {
  isSlnPathValid: boolean;
}

export interface NpmValidationResults {
  isPackageJsonPathValid: boolean;
}

export interface SettingsValidationResult {
  mainError?: string;

  solutionValidationResults: { [key: string]: SolutionValidationResults };
  npmValidationResults: { [key: string]: NpmValidationResults };

  isNuGetApiKeyValid: boolean;

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
  NuGetApiKey = 'nuGetApiKey',
  NpmAutoLogin = 'npmAutoLogin',
  NpmLogin = 'npmLogin',
  NpmPassword = 'npmPassword',
  NpmEmail = 'npmEmail'
}

export interface BaseAction extends Redux.Action<string> {
  payload?: any;
}

export type ThunkAction<A extends Action<any> = any> = ReduxThunkAction<any, AppState, any, A>;
