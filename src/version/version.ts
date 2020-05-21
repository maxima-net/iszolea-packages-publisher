export const PACKAGE_VERSION_CUSTOM_BETA_REGEX =      /^(\d+)\.(\d+)\.(\d+)(?:([^\r\n\t\f\v.]+?)\.(\d*))?$/;
export const PACKAGE_VERSION_CUSTOM_BETA_SOFT_REGEX = /^(\d+)\.(\d+)\.(\d+)(?:([^\r\n\t\f\v.]+?)\.?(\d*))?$/;

export interface VersionInfo {
  major: number;
  minor: number;
  patch: number;
  betaText: string | undefined;
  betaIndex: number | undefined;
}
