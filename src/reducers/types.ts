import { UpdateInfo } from 'electron-updater';
import { PackageSet } from '../utils/path-helper';

export interface AppState {
  settings: Settings;
  displaySettingsView: boolean;

  updateStatus: UpdateStatus;
  updateInfo: UpdateInfo | undefined;

  availablePackages: PackageSet[];
  packageSetId: number | undefined;
  versionProviderName: string;
  newVersion: string;
  isCustomVersionSelection: boolean;
  isEverythingCommitted: boolean | undefined;
  publishingInfo: PublishingInfo | undefined;
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
  isEverythingCommitted?: boolean;
  isVersionApplied?: boolean;
  isBuildCompleted?: boolean;
  isPackagePublished?: boolean;
  isCommitMade?: boolean;
  isRejectAllowed?: boolean;
  isRejected?: boolean;
  error?: string
  isExecuting: boolean;
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
