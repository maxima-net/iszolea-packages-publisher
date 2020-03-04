import { VersionInfo, IszoleaVersionInfo, PACKAGE_VERSION_REGEX_SOFT } from './version';
import IszoleaVersionValidator from './iszolea-version-validator';

export interface PackageVersionInfo {
  rawVersion: string;
  isValid: boolean;
  parsedVersion: IszoleaVersionInfo | undefined;
}

export const parseVersionsList = (data: string): PackageVersionInfo[] => {
  const regex = new RegExp(/.* (.*)/gm);
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

export const parseVersion = (version: string): VersionInfo | undefined => {
  let result: VersionInfo | undefined = undefined; 
  const regex = /(\d+)\.(\d+)\.(\d+)(?:-)?(.*)?/;
  const matchResult = version.match(regex);
  
  if(matchResult && matchResult.length >= 3) {
    result = {
      major: +matchResult[1],
      minor: +matchResult[2],
      patch: +matchResult[3],
      suffix: matchResult[4]
    };
  }
  
  return result;
};

export const parseIszoleaVersion = (version: string): IszoleaVersionInfo | undefined => {
  let result: IszoleaVersionInfo | undefined = undefined; 
  const matchResult = version.match(PACKAGE_VERSION_REGEX_SOFT);
  
  if(matchResult && matchResult.length >= 3) {
    result = {
      major: +matchResult[1],
      minor: +matchResult[2],
      patch: +matchResult[3],
      betaIndex: matchResult[4] ? +matchResult[4] : undefined
    };
  }
  
  return result;
};