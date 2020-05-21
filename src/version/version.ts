export const PACKAGE_VERSION_REGEX =      /^(\d+)\.(\d+)\.(\d+)(?:-beta\.(\d+))?$/;
export const PACKAGE_VERSION_REGEX_SOFT = /^(\d+)\.(\d+)\.(\d+)(?:-beta\.?(\d*))?$/;

export interface VersionInfo {
  major: number;
  minor: number;
  patch: number;
  betaIndex: number | undefined;
}
