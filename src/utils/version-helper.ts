export interface ValidationResult {
  isValid: boolean;
  packageVersionError: string | undefined;
}

export class VersionHelper {
  private static packageVersionRegex = /^(\d+)\.(\d+)\.(\d+)(?:-beta\.(\d+))?$/;

  static validateVersion(packageVersion: string): ValidationResult {
    const packageVersionMatch = this.packageVersionRegex.exec(packageVersion);

    const result: ValidationResult = {
      isValid: !!packageVersionMatch,
      packageVersionError: !packageVersionMatch ? `The version should match the pattern '1.2.3[-beta.4]'` : undefined
    };

    return result;
  }

  static getFileAndAssemblyVersion(packageVersion: string): string | undefined {
    const packageVersionMatch = this.packageVersionRegex.exec(packageVersion);

    if (!packageVersionMatch) {
      return undefined;
    }

    return `${packageVersionMatch[1]}.${packageVersionMatch[2]}.${packageVersionMatch[3]}${packageVersionMatch[4] ? `.${packageVersionMatch[4]}` : ''}`;
  }
}
