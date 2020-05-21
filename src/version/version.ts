export const PACKAGE_VERSION_REGEX =      /^(\d+)\.(\d+)\.(\d+)(?:-beta\.(\d+))?$/;
export const PACKAGE_VERSION_REGEX_SOFT = /^(\d+)\.(\d+)\.(\d+)(?:-beta\.?(\d*))?$/;
export const PACKAGE_VERSION_REGEX_CUSTOM_BETA_SOFT = /^(\d+)\.(\d+)\.(\d+)(?:([^\r\n\t\f\v.]+?)\.?(\d*))?$/;

export interface VersionInfo {
  major: number;
  minor: number;
  patch: number;
  betaText: string | undefined;
  betaIndex: number | undefined;
}
