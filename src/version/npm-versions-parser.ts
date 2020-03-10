import { PackageVersionInfo } from './nuget-versions-parser';
import IszoleaVersionValidator from './iszolea-version-validator';
import { parseIszoleaVersion } from './version-parser';

export const parseVersionsList = (data: string): PackageVersionInfo[] => {
  const regex = new RegExp(/'(.*?.)'/gm);
  const result: PackageVersionInfo[] = [];
  let match = regex.exec(data);

  const validator = new IszoleaVersionValidator();

  while (match != null) {
    const rawVersion = match[1];
    const parsedVersion = parseIszoleaVersion(rawVersion);
    const isValid = validator.validate(rawVersion).isValid;
    
    result.push({ rawVersion, parsedVersion, isValid });
    match = regex.exec(data);
  }

  return result;
};
