import { PackageVersionInfo } from './nuget-versions-parser';

export const sort = (a: PackageVersionInfo, b: PackageVersionInfo) => {
  if (!a.parsedVersion || !b.parsedVersion) {
    return b.rawVersion.localeCompare(a.rawVersion);
  }

  const va = a.parsedVersion;
  const vb = b.parsedVersion;

  if (va.major !== vb.major) {
    return vb.major - va.major;
  } else if (va.minor !== vb.minor) {
    return vb.minor - va.minor;
  } else if (va.patch !== vb.patch) {
    return vb.patch - va.patch;
  } else {
    return (vb.betaIndex || Number.MAX_VALUE) - (va.betaIndex || Number.MAX_VALUE);
  }
};
