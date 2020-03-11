import { IszoleaVersionInfo } from './version';
import IszoleaVersionValidator from './iszolea-version-validator';
import { parseIszoleaVersion } from './version-parser';
import escapeStringRegexp  from 'escape-string-regexp';

export interface PackageVersionInfo {
  rawVersion: string;
  isValid: boolean;
  parsedVersion: IszoleaVersionInfo | undefined;
}

export const parseVersionsList = (data: string, packageName: string): PackageVersionInfo[] => {
  const regex = new RegExp(`${escapeStringRegexp(packageName)} (.*)`, 'gm');
  const result: PackageVersionInfo[] = [];
  let match = regex.exec(data);

  const validator = new IszoleaVersionValidator();

  while (match != null) {
    const rawVersion = match[1];
    const parsedVersion = parseIszoleaVersion(rawVersion);
    const isValid = validator.validate(rawVersion).isValid;
    
    if(!match[1].toLowerCase().includes('found')) {
      result.push({ rawVersion, parsedVersion, isValid });
    }
    match = regex.exec(data);
  }

  return result;
};
