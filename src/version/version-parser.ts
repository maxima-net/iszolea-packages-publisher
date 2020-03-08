import { VersionInfo, IszoleaVersionInfo, PACKAGE_VERSION_REGEX_SOFT } from './version';

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
