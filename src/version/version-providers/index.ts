import { IszoleaVersionInfo, VersionInfo } from '../version';
export { VersionProviderFactory } from './version-provider-factory';

export interface TargetVersionInfo {
  version: VersionInfo;
  description: string;
}

export interface VersionProvider {
  getName(): string;
  getNewVersion(): IszoleaVersionInfo | undefined;
  getNewVersionString(): string | undefined;
  canGenerateNewVersion(): boolean;
  isCustom(): boolean;
}
