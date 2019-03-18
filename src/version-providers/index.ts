export { VersionProviderFactory } from './version-provider-factory';

export interface VersionProvider {
  getName(): string;
  getNewVersion(): IszoleaVersionInfo | undefined;
  getNewVersionString(): string | undefined;
  getAssemblyAndFileVersion(): string | undefined;
  canGenerateNewVersion(): boolean;
  isCustom(): boolean;
}

export interface VersionInfo {
  major: number;
  minor: number;
  patch: number;
  suffix: string | undefined;
}

export interface IszoleaVersionInfo {
  major: number;
  minor: number;
  patch: number;
  betaIndex: number | undefined;
}
