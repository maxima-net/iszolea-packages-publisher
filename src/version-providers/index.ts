export { VersionProviderFactory } from './version-provider-factory';

export interface VersionProvider {
  getName(): string;
  getNewVersion(): string | undefined;
  canGenerateNewVersion(): boolean;
  isCustom(): boolean;
}

export interface VersionInfo {
  major: number;
  minor: number;
  patch: number;
  suffix: string | undefined;
}
