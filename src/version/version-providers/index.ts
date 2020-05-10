import { IszoleaVersionInfo, VersionInfo } from '../version';
export { VersionProviderFactory } from './version-provider-factory';

export interface TargetVersionInfo {
  version: VersionInfo;
  description: TargetVersionDescription;
}

export interface VersionProvider {
  getName(): string;
  getNewVersion(): IszoleaVersionInfo | undefined;
  getNewVersionString(): string | undefined;
  getTargetVersionString(): string | undefined;
  canGenerateNewVersion(): boolean;
  isCustom(): boolean;
}

export interface TestCase {
  current: string;
  expectedTarget: TargetVersionInfo;
  expectedNew: string;
} 

export enum TargetVersionDescription {
  LOCAL_VERSION = 'the latest local version',
  LATEST_PUBLISHED_BETA_VERSION = 'the latest published beta version',
  LATEST_PUBLISHED_PATCH_VERSION = 'the latest published patch version',
  LATEST_PUBLISHED_MINOR_VERSION = 'the latest published minor version',
  LATEST_PUBLISHED_MAJOR_VERSION = 'the latest published major version',
}
