import { IszoleaVersionInfo } from '../version/version';
export { VersionProviderFactory } from './version-provider-factory';

export interface VersionProvider {
  getName(): string;
  getNewVersion(): IszoleaVersionInfo | undefined;
  getNewVersionString(): string | undefined;
  canGenerateNewVersion(): boolean;
  isCustom(): boolean;
}
