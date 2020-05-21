import { PACKAGE_VERSION_CUSTOM_BETA_REGEX } from './version';

export interface ValidationResult {
  isValid: boolean;
  packageVersionError: string | undefined;
}

export default class IszoleaVersionValidator {
  public validate(packageVersion: string): ValidationResult {
    const packageVersionMatch = PACKAGE_VERSION_CUSTOM_BETA_REGEX.exec(packageVersion);
  
    const result: ValidationResult = {
      isValid: !!packageVersionMatch,
      packageVersionError: !packageVersionMatch ? 'The version should match the pattern \'1.2.3[-beta.4]\'' : undefined
    };
  
    return result;
  }
}
