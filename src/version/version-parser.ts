import { VersionInfo, PACKAGE_VERSION_REGEX_CUSTOM_BETA_SOFT } from './version';

export const parseIszoleaVersion = (version: string): VersionInfo | undefined => {
  let result: VersionInfo | undefined = undefined; 
  const matchResult = version.match(PACKAGE_VERSION_REGEX_CUSTOM_BETA_SOFT);
  
  if(matchResult && matchResult.length >= 3) {
    result = {
      major: +matchResult[1],
      minor: +matchResult[2],
      patch: +matchResult[3],
      betaText: matchResult[4] ? matchResult[4] : undefined,
      betaIndex: matchResult[5] ? +matchResult[5] : undefined
    };
  }
  
  return result;
};
