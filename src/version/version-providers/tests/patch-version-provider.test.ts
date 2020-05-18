import PatchVersionProvider from '../patch-version-provider';
import { PackageVersionInfo } from '../../nuget-versions-parser';
import { TargetVersionDescription } from '../version-provider-base';
import { TestCase } from '.';

it('returns target version and new version', () => {
  const testCases: TestCase[] = [
    { 
      current: '1.2.3',
      expectedTarget: { version: { major: 1, minor: 2, patch: 3, betaIndex: undefined },  description: TargetVersionDescription.LOCAL_VERSION },
      expectedNew: '1.2.4' 
    },
    { 
      current: '10.12.2-beta.4',
      expectedTarget: { version: { major: 10, minor: 12, patch: 2, betaIndex: 4 },        description: TargetVersionDescription.LOCAL_VERSION },
      expectedNew: '10.12.2'
    }
  ];
  
  testCases.forEach((t) => {
    const provider = new PatchVersionProvider(t.current, []);
    const tvInfo = provider.getTargetVersionInfo();
    expect(tvInfo).toStrictEqual(t.expectedTarget);

    const newVersion = provider.getNewVersionString();
    expect(newVersion).toBe(t.expectedNew);
  });
});

it('returns target version and new version  with published version info', () => {
  const publishedVersions: PackageVersionInfo[] = [
    { parsedVersion: { major: 11, minor: 22, patch: 4, betaIndex: undefined },  rawVersion: '11.22.4',        isValid: true },

    { parsedVersion: { major: 11, minor: 22, patch: 5, betaIndex: 1 },          rawVersion: '11.22.5-beta-1', isValid: true },
    { parsedVersion: { major: 11, minor: 22, patch: 5, betaIndex: 2 },          rawVersion: '11.22.5-beta-2', isValid: true },
    { parsedVersion: { major: 11, minor: 22, patch: 5, betaIndex: undefined },  rawVersion: '11.22.5',        isValid: true },

    { parsedVersion: { major: 11, minor: 22, patch: 6, betaIndex: 1 },          rawVersion: '11.22.6-beta-1', isValid: true },
    { parsedVersion: { major: 11, minor: 22, patch: 6, betaIndex: undefined },  rawVersion: '11.22.6',        isValid: true },

    { parsedVersion: { major: 11, minor: 22, patch: 8, betaIndex: undefined },  rawVersion: '11.22.8',        isValid: true }
  ];

  const testCases: TestCase[] = [
    { 
      current: '11.22.2',
      expectedTarget: { version: { major: 11, minor: 22, patch: 8, betaIndex: undefined }, description: TargetVersionDescription.LATEST_PUBLISHED_PATCH_VERSION },
      expectedNew: '11.22.9' 
    },
    { 
      current: '11.22.3',
      expectedTarget: { version: { major: 11, minor: 22, patch: 8, betaIndex: undefined }, description: TargetVersionDescription.LATEST_PUBLISHED_PATCH_VERSION },
      expectedNew: '11.22.9' 
    },
    { 
      current: '11.22.6',
      expectedTarget: { version: { major: 11, minor: 22, patch: 8, betaIndex: undefined }, description: TargetVersionDescription.LATEST_PUBLISHED_PATCH_VERSION },
      expectedNew: '11.22.9' 
    },
    { 
      current: '11.22.7',
      expectedTarget: { version: { major: 11, minor: 22, patch: 8, betaIndex: undefined }, description: TargetVersionDescription.LATEST_PUBLISHED_PATCH_VERSION },
      expectedNew: '11.22.9' 
    },
    { 
      current: '11.22.8',
      expectedTarget: { version: { major: 11, minor: 22, patch: 8, betaIndex: undefined }, description: TargetVersionDescription.LOCAL_VERSION },
      expectedNew: '11.22.9' 
    },
    { 
      current: '11.22.9',
      expectedTarget: { version: { major: 11, minor: 22, patch: 9, betaIndex: undefined }, description: TargetVersionDescription.LOCAL_VERSION },
      expectedNew: '11.22.10' 
    },
  ];

  testCases.forEach((t) => {
    const provider = new PatchVersionProvider(t.current, publishedVersions);
    const tvInfo = provider.getTargetVersionInfo();
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

    { parsedVersion: { major: 11, minor: 22, patch: 8, betaIndex: undefined },  rawVersion: '11.22.8',        isValid: true }
  ];

  const testCases: TestCase[] = [
    { 
      current: '11.22.3-beta.4',
      expectedTarget: { version: { major: 11, minor: 22, patch: 3, betaIndex: 4 },          description: TargetVersionDescription.LOCAL_VERSION },
      expectedNew: '11.22.3' 
    },
    {
      current: '11.22.4-beta.4',
      expectedTarget: { version: { major: 11, minor: 22, patch: 8, betaIndex: undefined },  description: TargetVersionDescription.LATEST_PUBLISHED_PATCH_VERSION },
      expectedNew: '11.22.9' 
    },
    {
      current: '11.22.5-beta.2',
      expectedTarget: { version: { major: 11, minor: 22, patch: 8, betaIndex: undefined },  description: TargetVersionDescription.LATEST_PUBLISHED_PATCH_VERSION },
      expectedNew: '11.22.9' 
    },
    { 
      current: '11.22.9-beta.1',
      expectedTarget: { version: { major: 11, minor: 22, patch: 9, betaIndex: 1 },          description: TargetVersionDescription.LOCAL_VERSION },
      expectedNew: '11.22.9' 
    },
    { 
      current: '11.22.9-beta.3',
      expectedTarget: { version: { major: 11, minor: 22, patch: 9, betaIndex: 3 },          description: TargetVersionDescription.LOCAL_VERSION },
      expectedNew: '11.22.9' 
    },
  ];

  testCases.forEach((t) => {
    const provider = new PatchVersionProvider(t.current, publishedVersions);
    const tvInfo = provider.getTargetVersionInfo();
    expect(tvInfo).toStrictEqual(t.expectedTarget);

    const newVersion = provider.getNewVersionString();
    expect(newVersion).toBe(t.expectedNew);
  });
});

it('returns target version and new version for current beta with published version info (latest is beta)', () => {
  const publishedVersions: PackageVersionInfo[] = [
    { parsedVersion: { major: 11, minor: 22, patch: 4, betaIndex: undefined },  rawVersion: '11.22.4',        isValid: true },

    { parsedVersion: { major: 11, minor: 22, patch: 5, betaIndex: 1 },          rawVersion: '11.22.5-beta-1', isValid: true },
    { parsedVersion: { major: 11, minor: 22, patch: 5, betaIndex: 2 },          rawVersion: '11.22.5-beta-2', isValid: true },
    { parsedVersion: { major: 11, minor: 22, patch: 5, betaIndex: undefined },  rawVersion: '11.22.5',        isValid: true },

    { parsedVersion: { major: 11, minor: 22, patch: 6, betaIndex: 1 },          rawVersion: '11.22.6-beta-1', isValid: true },
    { parsedVersion: { major: 11, minor: 22, patch: 6, betaIndex: undefined },  rawVersion: '11.22.6',        isValid: true },

    { parsedVersion: { major: 11, minor: 22, patch: 8, betaIndex: 1 },          rawVersion: '11.22.8-beta-1', isValid: true }
  ];

  const testCases: TestCase[] = [
    {
      current: '11.22.5-beta.2',
      expectedTarget: { version: { major: 11, minor: 22, patch: 8, betaIndex: 1 }, description: TargetVersionDescription.LATEST_PUBLISHED_BETA_VERSION },
      expectedNew: '11.22.9' 
    },
  ];

  testCases.forEach((t) => {
    const provider = new PatchVersionProvider(t.current, publishedVersions);
    const tvInfo = provider.getTargetVersionInfo();
    expect(tvInfo).toStrictEqual(t.expectedTarget);

    const newVersion = provider.getNewVersionString();
    expect(newVersion).toBe(t.expectedNew);
  });
});
