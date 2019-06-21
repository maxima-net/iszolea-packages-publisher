export interface ValidationResult {
  isValid: boolean;
  packageVersionError: string | undefined;
}

const packageVersionRegex = /^(\d+)\.(\d+)\.(\d+)(?:-beta\.(\d+))?$/;

export function validateVersion(packageVersion: string): ValidationResult {
  const packageVersionMatch = packageVersionRegex.exec(packageVersion);

  const result: ValidationResult = {
    isValid: !!packageVersionMatch,
    packageVersionError: !packageVersionMatch ? `The version should match the pattern '1.2.3[-beta.4]'` : undefined
  };

  return result;
}

export function getFileAndAssemblyVersion(packageVersion: string): string | undefined {
  const packageVersionMatch = packageVersionRegex.exec(packageVersion);

  if (!packageVersionMatch) {
    return undefined;
  }

  return `${packageVersionMatch[1]}.${packageVersionMatch[2]}.${packageVersionMatch[3]}${packageVersionMatch[4] ? `.${packageVersionMatch[4]}` : ''}`;
}
