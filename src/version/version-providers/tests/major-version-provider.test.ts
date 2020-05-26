import MajorVersionProvider from '../major-version-provider';
import { PackageVersionInfo } from '../../nuget-versions-parser';
import { TargetVersionDescription } from '../version-provider-base';
import { TestCase } from '.';

it('returns target version and new version', () => {
  const testCases: TestCase[] = [
    { 
      current: '1.2.3',
      expectedTarget: { version: { major: 1, minor: 2, patch: 3, betaText: undefined, betaIndex: undefined }, description: TargetVersionDescription.LOCAL_VERSION },
      expectedNew: '2.0.0' 
    },
    { 
      current: '10.12.2-beta.4',
      expectedTarget: { version: { major: 10, minor: 12, patch: 2, betaText: '-beta', betaIndex: 4 }, description: TargetVersionDescription.LOCAL_VERSION },
      expectedNew: '11.0.0'
    }
  ];
  
  testCases.forEach((t) => {
    const provider = new MajorVersionProvider(t.current, [], '-beta');
    const tvInfo = provider.getTargetVersionInfo();
    expect(tvInfo).toStrictEqual(t.expectedTarget);

    const newVersion = provider.getNewVersionString();
    expect(newVersion).toBe(t.expectedNew);
  });
});

it('returns target version and new version with published version info', () => {
  const publishedVersions: PackageVersionInfo[] = [
    { parsedVersion: { major: 10, minor: 2, patch: 74, betaText: undefined, betaIndex: undefined },   rawVersion: '10.2.74',        isValid: true },
    { parsedVersion: { major: 11, minor: 22, patch: 0, betaText: undefined, betaIndex: undefined },   rawVersion: '11.22.0',        isValid: true },
    { parsedVersion: { major: 11, minor: 22, patch: 4, betaText: undefined, betaIndex: undefined },   rawVersion: '11.22.4',        isValid: true },
    { parsedVersion: { major: 12, minor: 10, patch: 1, betaText: '-beta', betaIndex: 1 },             rawVersion: '12.10.1-beta-1', isValid: true },
    { parsedVersion: { major: 12, minor: 10, patch: 1, betaText: '-beta', betaIndex: 3 },             rawVersion: '12.10.1-beta-3', isValid: true },
    { parsedVersion: { major: 12, minor: 10, patch: 1, betaText: undefined, betaIndex: undefined },   rawVersion: '12.10.1',        isValid: true },
  ];

  const testCases: TestCase[] = [
    { 
      current: '8.20.3',
      expectedTarget: { version: { major: 8, minor: 20, patch: 3, betaText: undefined, betaIndex: undefined }, description: TargetVersionDescription.LOCAL_VERSION },
      expectedNew: '9.0.0' 
    },
    { 
      current: '8.20.3-beta.1',
      expectedTarget: { version: { major: 8, minor: 20, patch: 3, betaText: '-beta', betaIndex: 1 }, description: TargetVersionDescription.LOCAL_VERSION },
      expectedNew: '9.0.0' 
    },
    { 
      current: '9.1.13',
      expectedTarget: { version: { major: 12, minor: 10, patch: 1, betaText: undefined, betaIndex: undefined }, description: TargetVersionDescription.LATEST_PUBLISHED_MAJOR_VERSION },
      expectedNew: '13.0.0' 
    },
    { 
      current: '9.1.13-beta.2',
      expectedTarget: { version: { major: 12, minor: 10, patch: 1, betaText: undefined, betaIndex: undefined }, description: TargetVersionDescription.LATEST_PUBLISHED_MAJOR_VERSION },
      expectedNew: '13.0.0' 
    },
    { 
      current: '10.0.1',
      expectedTarget: { version: { major: 12, minor: 10, patch: 1, betaText: undefined, betaIndex: undefined }, description: TargetVersionDescription.LATEST_PUBLISHED_MAJOR_VERSION },
      expectedNew: '13.0.0'
    },
    { 
      current: '10.0.1-beta.3',
      expectedTarget: { version: { major: 12, minor: 10, patch: 1, betaText: undefined, betaIndex: undefined }, description: TargetVersionDescription.LATEST_PUBLISHED_MAJOR_VERSION },
      expectedNew: '13.0.0' 
    },
    { 
      current: '11.11.11',
      expectedTarget: { version: { major: 12, minor: 10, patch: 1, betaText: undefined, betaIndex: undefined }, description: TargetVersionDescription.LATEST_PUBLISHED_MAJOR_VERSION },
      expectedNew: '13.0.0' 
    },
    { 
      current: '11.11.11-beta.4',
      expectedTarget: { version: { major: 12, minor: 10, patch: 1, betaText: undefined, betaIndex: undefined }, description: TargetVersionDescription.LATEST_PUBLISHED_MAJOR_VERSION },
      expectedNew: '13.0.0' 
    },
    { 
      current: '13.0.1',
      expectedTarget: { version: { major: 13, minor: 0, patch: 1, betaText: undefined, betaIndex: undefined }, description: TargetVersionDescription.LOCAL_VERSION },
      expectedNew: '14.0.0' 
    },
    { 
      current: '13.0.1-beta.5',
      expectedTarget: { version: { major: 13, minor: 0, patch: 1, betaText: '-beta', betaIndex: 5 }, description: TargetVersionDescription.LOCAL_VERSION },
      expectedNew: '14.0.0' 
    },
  ];

  testCases.forEach((t) => {
    const provider = new MajorVersionProvider(t.current, publishedVersions, '-beta');
    const tvInfo = provider.getTargetVersionInfo();
    expect(tvInfo).toStrictEqual(t.expectedTarget);

    const newVersion = provider.getNewVersionString();
    expect(newVersion).toBe(t.expectedNew);
  });
});

it('returns target version and new version with published version info (case with latest beta)', () => {
  const publishedVersions: PackageVersionInfo[] = [
    { parsedVersion: { major: 10, minor: 2, patch: 74, betaText: undefined, betaIndex: undefined },   rawVersion: '10.2.74',        isValid: true },
    { parsedVersion: { major: 11, minor: 22, patch: 0, betaText: undefined, betaIndex: undefined },   rawVersion: '11.22.0',        isValid: true },
    { parsedVersion: { major: 11, minor: 22, patch: 4, betaText: undefined, betaIndex: undefined },   rawVersion: '11.22.4',        isValid: true },
    { parsedVersion: { major: 12, minor: 10, patch: 1, betaText: '-beta', betaIndex: 1 },             rawVersion: '12.10.1-beta-1', isValid: true },
    { parsedVersion: { major: 12, minor: 10, patch: 1, betaText: '-beta', betaIndex: 3 },             rawVersion: '12.10.1-beta-3', isValid: true },
  ];

  const testCases: TestCase[] = [
    { 
      current: '8.20.3',
      expectedTarget: { version: { major: 8, minor: 20, patch: 3, betaText: undefined, betaIndex: undefined }, description: TargetVersionDescription.LOCAL_VERSION },
      expectedNew: '9.0.0' 
    },
    { 
      current: '8.20.3-beta.1',
      expectedTarget: { version: { major: 8, minor: 20, patch: 3, betaText: '-beta', betaIndex: 1 }, description: TargetVersionDescription.LOCAL_VERSION },
      expectedNew: '9.0.0' 
    },
    { 
      current: '9.1.13',
      expectedTarget: { version: { major: 12, minor: 10, patch: 1, betaText: '-beta', betaIndex: 3 }, description: TargetVersionDescription.LATEST_PUBLISHED_BETA_VERSION },
      expectedNew: '13.0.0' 
    },
    { 
      current: '9.1.13-beta.2',
      expectedTarget: { version: { major: 12, minor: 10, patch: 1, betaText: '-beta', betaIndex: 3 }, description: TargetVersionDescription.LATEST_PUBLISHED_BETA_VERSION },
      expectedNew: '13.0.0' 
    },
    { 
      current: '10.0.1',
      expectedTarget: { version: { major: 12, minor: 10, patch: 1, betaText: '-beta', betaIndex: 3 }, description: TargetVersionDescription.LATEST_PUBLISHED_BETA_VERSION },
      expectedNew: '13.0.0' 
    },
    { 
      current: '10.0.1-beta.3',
      expectedTarget: { version: { major: 12, minor: 10, patch: 1, betaText: '-beta', betaIndex: 3 }, description: TargetVersionDescription.LATEST_PUBLISHED_BETA_VERSION },
      expectedNew: '13.0.0' 
    },
    { 
      current: '11.11.11',
      expectedTarget: { version: { major: 12, minor: 10, patch: 1, betaText: '-beta', betaIndex: 3 }, description: TargetVersionDescription.LATEST_PUBLISHED_BETA_VERSION },
      expectedNew: '13.0.0' 
    },
    { 
      current: '11.11.11-beta.4',
      expectedTarget: { version: { major: 12, minor: 10, patch: 1, betaText: '-beta', betaIndex: 3 }, description: TargetVersionDescription.LATEST_PUBLISHED_BETA_VERSION },
      expectedNew: '13.0.0' 
    },
    { 
      current: '13.0.1',
      expectedTarget: { version: { major: 13, minor: 0, patch: 1, betaText: undefined, betaIndex: undefined }, description: TargetVersionDescription.LOCAL_VERSION },
      expectedNew: '14.0.0' 
    },
    { 
      current: '13.0.1-beta.5',
      expectedTarget: { version: { major: 13, minor: 0, patch: 1, betaText: '-beta', betaIndex: 5 }, description: TargetVersionDescription.LOCAL_VERSION },
      expectedNew: '14.0.0' 
    },
  ];

  testCases.forEach((t) => {
    const provider = new MajorVersionProvider(t.current, publishedVersions, '-beta');
    const tvInfo = provider.getTargetVersionInfo();
    expect(tvInfo).toStrictEqual(t.expectedTarget);

    const newVersion = provider.getNewVersionString();
    expect(newVersion).toBe(t.expectedNew);
  });
});
