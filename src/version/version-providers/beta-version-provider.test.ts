import BetaVersionProvider from './beta-version-provider';
import { PackageVersionInfo } from '../nuget-versions-parser';
import { TestCase, TargetVersionDescription } from '.';

it('returns target version and new version', () => {
  const testCases: TestCase[] = [
    { 
      current: '11.22.3',
      expectedTarget: { version: { major: 11, minor: 22, patch: 3, suffix: undefined }, description: TargetVersionDescription.LOCAL_VERSION },
      expectedNew: '11.22.4-beta.1' 
    },
    { 
      current: '11.22.4-beta.1',
      expectedTarget: { version: { major: 11, minor: 22, patch: 4, suffix: 'beta.1' }, description: TargetVersionDescription.LOCAL_VERSION },
      expectedNew: '11.22.4-beta.2'
    },
    { 
      current: '11.22.4-beta.13',
      expectedTarget: { version: { major: 11, minor: 22, patch: 4, suffix: 'beta.13' }, description: TargetVersionDescription.LOCAL_VERSION },
      expectedNew: '11.22.4-beta.14'
    },
  ];
  
  testCases.forEach((t) => {
    const provider = new BetaVersionProvider(t.current, []);
    const tvInfo = provider.getTargetVersion();
    expect(tvInfo).toStrictEqual(t.expectedTarget);

    const newVersion = provider.getNewVersionString();
    expect(newVersion).toBe(t.expectedNew);
  });
});

it('returns target version and new version for current beta with published version info', () => {
  const publishedVersions: PackageVersionInfo[] = [
    { parsedVersion: { major: 11, minor: 22, patch: 4, betaIndex: undefined },  rawVersion: '11.22.4',        isValid: true },

    { parsedVersion: { major: 11, minor: 22, patch: 5, betaIndex: 1 },          rawVersion: '11.22.5-beta-1', isValid: true },
    { parsedVersion: { major: 11, minor: 22, patch: 5, betaIndex: 2 },          rawVersion: '11.22.5-beta-2', isValid: true },
    { parsedVersion: { major: 11, minor: 22, patch: 5, betaIndex: undefined },  rawVersion: '11.22.5',        isValid: true },

    { parsedVersion: { major: 11, minor: 22, patch: 6, betaIndex: 1 },          rawVersion: '11.22.6-beta-1', isValid: true },
    { parsedVersion: { major: 11, minor: 22, patch: 6, betaIndex: undefined },  rawVersion: '11.22.6',        isValid: true },

    { parsedVersion: { major: 11, minor: 22, patch: 7, betaIndex: 1 },          rawVersion: '11.22.7-beta-1', isValid: true },
    { parsedVersion: { major: 11, minor: 22, patch: 7, betaIndex: 2 },          rawVersion: '11.22.7-beta-2', isValid: true },

    { parsedVersion: { major: 11, minor: 22, patch: 8, betaIndex: undefined },  rawVersion: '11.22.8',        isValid: true }
  ];

  const testCases: TestCase[] = [
    { 
      current: '11.22.3-beta.1', 
      expectedTarget: { version: { major: 11, minor: 22, patch: 3, suffix: 'beta.1' }, description: TargetVersionDescription.LOCAL_VERSION },
      expectedNew: '11.22.3-beta.2'
    },
    { 
      current: '11.22.4-beta.1', 
      expectedTarget: { version: { major: 11, minor: 22, patch: 8, suffix: undefined }, description: TargetVersionDescription.LATEST_PUBLISHED_PATCH_VERSION }, 
      expectedNew: '11.22.9-beta.1' 
    },
    { 
      current: '11.22.5-beta.1', 
      expectedTarget: { version: { major: 11, minor: 22, patch: 8, suffix: undefined }, description: TargetVersionDescription.LATEST_PUBLISHED_PATCH_VERSION }, 
      expectedNew: '11.22.9-beta.1' 
    },
    { 
      current: '11.22.5-beta.2', 
      expectedTarget: { version: { major: 11, minor: 22, patch: 8, suffix: undefined }, description: TargetVersionDescription.LATEST_PUBLISHED_PATCH_VERSION }, 
      expectedNew: '11.22.9-beta.1' 
    },
    { 
      current: '11.22.5-beta.3', 
      expectedTarget: { version: { major: 11, minor: 22, patch: 8, suffix: undefined }, description: TargetVersionDescription.LATEST_PUBLISHED_PATCH_VERSION }, 
      expectedNew: '11.22.9-beta.1'
    },
    { 
      current: '11.22.6-beta.1',
      expectedTarget: { version: { major: 11, minor: 22, patch: 8, suffix: undefined }, description: TargetVersionDescription.LATEST_PUBLISHED_PATCH_VERSION }, 
      expectedNew: '11.22.9-beta.1'
    },
    { 
      current: '11.22.7-beta.1',
      expectedTarget: { version: { major: 11, minor: 22, patch: 7, suffix: 'beta.2' }, description: TargetVersionDescription.LATEST_PUBLISHED_BETA_VERSION }, 
      expectedNew: '11.22.7-beta.3' 
    },
    { 
      current: '11.22.7-beta.2',
      expectedTarget: { version: { major: 11, minor: 22, patch: 7, suffix: 'beta.2' }, description: TargetVersionDescription.LOCAL_VERSION }, 
      expectedNew: '11.22.7-beta.3' 
    },
    { 
      current: '11.22.7-beta.3',
      expectedTarget: { version: { major: 11, minor: 22, patch: 7, suffix: 'beta.3' }, description: TargetVersionDescription.LOCAL_VERSION }, 
      expectedNew: '11.22.7-beta.4' 
    },
    { 
      current: '11.22.8-beta.1', 
      expectedTarget: { version: { major: 11, minor: 22, patch: 8, suffix: 'beta.1' }, description: TargetVersionDescription.LOCAL_VERSION }, 
      expectedNew: '11.22.8-beta.2' 
    },
    { 
      current: '11.22.9-beta.1', 
      expectedTarget: { version: { major: 11, minor: 22, patch: 9, suffix: 'beta.1' }, description: TargetVersionDescription.LOCAL_VERSION }, 
      expectedNew: '11.22.9-beta.2' 
    },
  ];

  testCases.forEach((t) => {
    const provider = new BetaVersionProvider(t.current, publishedVersions);
    const tvInfo = provider.getTargetVersion();
    expect(tvInfo).toStrictEqual(t.expectedTarget);

    const newVersion = provider.getNewVersionString();
    expect(newVersion).toBe(t.expectedNew);
  });
});

it('returns target version and new version for new beta with published version info', () => {
  const publishedVersions: PackageVersionInfo[] = [
    { parsedVersion: { major: 11, minor: 22, patch: 4, betaIndex: undefined },  rawVersion: '11.22.4',        isValid: true },

    { parsedVersion: { major: 11, minor: 22, patch: 5, betaIndex: 1 },          rawVersion: '11.22.5-beta-1', isValid: true },
    { parsedVersion: { major: 11, minor: 22, patch: 5, betaIndex: 2 },          rawVersion: '11.22.5-beta-2', isValid: true },
    { parsedVersion: { major: 11, minor: 22, patch: 5, betaIndex: undefined },  rawVersion: '11.22.5',        isValid: true },

    { parsedVersion: { major: 11, minor: 22, patch: 6, betaIndex: undefined },  rawVersion: '11.22.6',        isValid: true },
    
    { parsedVersion: { major: 11, minor: 22, patch: 7, betaIndex: 1 },          rawVersion: '11.22.7-beta-1', isValid: true },
    { parsedVersion: { major: 11, minor: 22, patch: 7, betaIndex: 2 },          rawVersion: '11.22.7-beta-2', isValid: true },

    { parsedVersion: { major: 11, minor: 22, patch: 8, betaIndex: undefined },  rawVersion: '11.22.8',        isValid: true },
  ];

  const testCases: TestCase[] = [
    {
      current: '11.22.2',
      expectedTarget: { version: { major: 11, minor: 22, patch: 8, suffix: undefined }, description: TargetVersionDescription.LATEST_PUBLISHED_PATCH_VERSION },
      expectedNew: '11.22.9-beta.1'
    },
    {
      current: '11.22.3',
      expectedTarget: { version: { major: 11, minor: 22, patch: 8, suffix: undefined }, description: TargetVersionDescription.LATEST_PUBLISHED_PATCH_VERSION },
      expectedNew: '11.22.9-beta.1'
    },
    {
      current: '11.22.4',
      expectedTarget: { version: { major: 11, minor: 22, patch: 8, suffix: undefined }, description: TargetVersionDescription.LATEST_PUBLISHED_PATCH_VERSION },
      expectedNew: '11.22.9-beta.1'
    },
    {
      current: '11.22.5',
      expectedTarget: { version: { major: 11, minor: 22, patch: 8, suffix: undefined }, description: TargetVersionDescription.LATEST_PUBLISHED_PATCH_VERSION },
      expectedNew: '11.22.9-beta.1'
    },
    {
      current: '11.22.6',
      expectedTarget: { version: { major: 11, minor: 22, patch: 8, suffix: undefined }, description: TargetVersionDescription.LATEST_PUBLISHED_PATCH_VERSION },
      expectedNew: '11.22.9-beta.1'
    },
    {
      current: '11.22.7',
      expectedTarget: { version: { major: 11, minor: 22, patch: 7, suffix: 'beta.2' }, description: TargetVersionDescription.LATEST_PUBLISHED_BETA_VERSION },
      expectedNew: '11.22.7-beta.3'
    },
    {
      current: '11.22.8',
      expectedTarget: { version: { major: 11, minor: 22, patch: 8, suffix: undefined }, description: TargetVersionDescription.LOCAL_VERSION },
      expectedNew: '11.22.9-beta.1'
    },
    {
      current: '11.22.9',
      expectedTarget: { version: { major: 11, minor: 22, patch: 9, suffix: undefined }, description: TargetVersionDescription.LOCAL_VERSION },
      expectedNew: '11.22.10-beta.1'
    },
  ];

  testCases.forEach((t) => {
    const provider = new BetaVersionProvider(t.current, publishedVersions);
    const tvInfo = provider.getTargetVersion();
    expect(tvInfo).toStrictEqual(t.expectedTarget);

    const newVersion = provider.getNewVersionString();
    expect(newVersion).toBe(t.expectedNew);
  });
});

it('returns target version and new version for new beta with published version info', () => {
  const publishedVersions: PackageVersionInfo[] = [
    { parsedVersion: { major: 11, minor: 22, patch: 4, betaIndex: undefined },  rawVersion: '11.22.4',        isValid: true },

    { parsedVersion: { major: 11, minor: 22, patch: 5, betaIndex: 1 },          rawVersion: '11.22.5-beta-1', isValid: true },
    { parsedVersion: { major: 11, minor: 22, patch: 5, betaIndex: 2 },          rawVersion: '11.22.5-beta-2', isValid: true },

    { parsedVersion: { major: 11, minor: 22, patch: 6, betaIndex: 1 },          rawVersion: '11.22.6-beta-1', isValid: true },
    { parsedVersion: { major: 11, minor: 22, patch: 6, betaIndex: 2 },          rawVersion: '11.22.6-beta-2', isValid: true },
  ];

  const testCases: TestCase[] = [
    {
      current: '11.22.4',
      expectedTarget: { version: { major: 11, minor: 22, patch: 6, suffix: 'beta.2' }, description: TargetVersionDescription.LATEST_PUBLISHED_PATCH_VERSION },
      expectedNew: '11.22.7-beta.1'
    },
  ];

  testCases.forEach((t) => {
    const provider = new BetaVersionProvider(t.current, publishedVersions);
    const tvInfo = provider.getTargetVersion();
    expect(tvInfo).toStrictEqual(t.expectedTarget);

    const newVersion = provider.getNewVersionString();
    expect(newVersion).toBe(t.expectedNew);
  });
});
