import { IszoleaVersionInfo } from '../version';
export { VersionProviderFactory } from './version-provider-factory';

export interface VersionProvider {
  getName(): string;
  getNewVersion(): IszoleaVersionInfo | undefined;
  getNewVersionString(): string | undefined;
  getTargetVersionString(): string | undefined;
  canGenerateNewVersion(): boolean;
  isCustom(): boolean;
}

export interface CompareVersionsResult {
  equal: boolean;
  majorEqual: boolean;
  minorEqual: boolean;
  patchEqual: boolean;
  betaEqual: boolean;
}
