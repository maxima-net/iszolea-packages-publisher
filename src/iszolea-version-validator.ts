export interface ValidationResult {
  isValid: boolean;
  packageVersionError: string | undefined;
  fileAndAssemblyVersionError: string | undefined;
}

export class IszoleaVersionValidator {
  static packageVersionRegex = /^(\d+)\.(\d+)\.(\d+)(?:-beta\.(\d)+)?$/;
  static assemblyVersionRegex = /^(\d+)\.(\d+)\.(\d+)(?:\.(\d)+)?$/;
  
  static validateVersion(packageVersion: string, fileAndAssemblyVersion: string) : ValidationResult {
    const packageVersionMatch = this.packageVersionRegex.exec(packageVersion);
    const assemblyVersionMatch = this.assemblyVersionRegex.exec(fileAndAssemblyVersion);
    

    const result: ValidationResult = {
      isValid: false,
      packageVersionError: !packageVersionMatch ? `The version should match the pattern '1.2.3[-beta.4]'` : undefined,
      fileAndAssemblyVersionError: !assemblyVersionMatch ? `The version should match the pattern '1.2.3[.4]'` : undefined,
    };
    
    if(packageVersionMatch && packageVersionMatch.length >= 4 && assemblyVersionMatch && assemblyVersionMatch.length >= 4) {
      result.isValid = packageVersionMatch[1] === assemblyVersionMatch[1] 
        && packageVersionMatch[2] === assemblyVersionMatch[2]
        && packageVersionMatch[3] === assemblyVersionMatch[3]
        && packageVersionMatch[4] === assemblyVersionMatch[4]

      if(!result.isValid) {
        result.fileAndAssemblyVersionError = `Match versions: 'A.B.C[-beta.D]' <---> 'A.B.C[.D]'`;
      }
    }

    return result;
  }
}
