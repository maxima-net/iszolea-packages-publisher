export interface ValidationResult {
  isValid: boolean;
  packageVersionError: string | undefined;
}

const PACKAGE_VERSION_REGEX = /^(\d+)\.(\d+)\.(\d+)(?:-beta\.(\d+))?$/;

export function validateVersion(packageVersion: string): ValidationResult {
  const packageVersionMatch = PACKAGE_VERSION_REGEX.exec(packageVersion);

  const result: ValidationResult = {
    isValid: !!packageVersionMatch,
    packageVersionError: !packageVersionMatch ? `The version should match the pattern '1.2.3[-beta.4]'` : undefined
  };

  return result;
}

export function getFileAndAssemblyVersion(packageVersion: string): string | undefined {
  const pvMatch = PACKAGE_VERSION_REGEX.exec(packageVersion);

  if (!pvMatch) {
    return undefined;
  }

  return `${pvMatch[1]}.${pvMatch[2]}.${pvMatch[3]}${pvMatch[4] ? `.${pvMatch[4]}` : ''}`;
}
