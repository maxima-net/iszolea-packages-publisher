import { ValidationResult } from './validation-result';
import { PACKAGE_VERSION_REGEX } from './version';

export default class IszoleaVersionValidator {
  public validate(packageVersion: string): ValidationResult {
    const packageVersionMatch = PACKAGE_VERSION_REGEX.exec(packageVersion);
  
    const result: ValidationResult = {
      isValid: !!packageVersionMatch,
      packageVersionError: !packageVersionMatch ? `The version should match the pattern '1.2.3[-beta.4]'` : undefined
    };
  
    return result;
  }
}
