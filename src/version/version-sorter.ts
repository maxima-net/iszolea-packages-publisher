import { PackageVersionInfo } from './nuget-versions-parser';

export const sort = (a: PackageVersionInfo, b: PackageVersionInfo) => {
  if (!a.parsedVersion || !b.parsedVersion) {
    if (!a.parsedVersion && !b.parsedVersion) {
      return a.rawVersion.toLowerCase().localeCompare(b.rawVersion.toLowerCase());
    } if (a.parsedVersion && !b.parsedVersion) {
      return -1;
    } else {
      return 1;
    }
  }

  const va = a.parsedVersion;
  const vb = b.parsedVersion;

  if (va.major !== vb.major) {
    return vb.major - va.major;
  } else if (va.minor !== vb.minor) {
    return vb.minor - va.minor;
  } else if (va.patch !== vb.patch) {
    return vb.patch - va.patch;
  } else if (va.betaText === undefined || vb.betaText === undefined) {
    if (va.betaText !== undefined && vb.betaText === undefined) {
      return -1;
    } else if (va.betaText === undefined && vb.betaText !== undefined){
      return 1;
    }
  }
  if (va.betaText !== undefined && vb.betaText !== undefined && va.betaText !== vb.betaText) {
    return va.betaText.toLowerCase().localeCompare(vb.betaText.toLowerCase());
  }

  if (va.betaIndex !== undefined && vb.betaIndex === undefined) {
    return -1;
  } else if (va.betaIndex === undefined && vb.betaIndex !== undefined) {
    return 1;
  }

  const vaIndex = va.betaIndex !== undefined ? va.betaIndex : Number.MAX_VALUE;
  const vbIndex = vb.betaIndex !== undefined ? vb.betaIndex : Number.MAX_VALUE;
  
  return vbIndex - vaIndex;
};
