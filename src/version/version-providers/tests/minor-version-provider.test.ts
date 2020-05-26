import MinorVersionProvider from '../minor-version-provider';
import { PackageVersionInfo } from '../../nuget-versions-parser';
import { TargetVersionDescription } from '../version-provider-base';
import { TestCase } from '.';

it('returns target version and new version', () => {
  const testCases: TestCase[] = [
    { 
      current: '1.2.3',
      expectedTarget: { version: { major: 1, minor: 2, patch: 3, betaText: undefined, betaIndex: undefined },  description: TargetVersionDescription.LOCAL_VERSION },
      expectedNew: '1.3.0' 
    },
    { 
      current: '10.12.2-beta.4',
      expectedTarget: { version: { major: 10, minor: 12, patch: 2, betaText: '-beta', betaIndex: 4 },        description: TargetVersionDescription.LOCAL_VERSION },
      expectedNew: '10.13.0'
    }
  ];
  
  testCases.forEach((t) => {
    const provider = new MinorVersionProvider(t.current, [], '-beta');
    const tvInfo = provider.getTargetVersionInfo();
    expect(tvInfo).toStrictEqual(t.expectedTarget);

    const newVersion = provider.getNewVersionString();
    expect(newVersion).toBe(t.expectedNew);
  });
});

it('returns target version and new version with published version info', () => {
  const publishedVersions: PackageVersionInfo[] = [
    { parsedVersion: { major: 10, minor: 2, patch: 74, betaText: undefined, betaIndex: undefined },   rawVersion: '10.2.74',        isValid: true },
    { parsedVersion: { major: 11, minor: 22, patch: 4, betaText: undefined, betaIndex: undefined },   rawVersion: '11.22.4',        isValid: true },
    { parsedVersion: { major: 11, minor: 22, patch: 6, betaText: undefined, betaIndex: undefined },   rawVersion: '11.22.6',        isValid: true },
    { parsedVersion: { major: 11, minor: 22, patch: 8, betaText: undefined, betaIndex: undefined },   rawVersion: '11.22.8',        isValid: true },

    { parsedVersion: { major: 11, minor: 23, patch: 0, betaText: undefined, betaIndex: undefined },   rawVersion: '11.23.0',        isValid: true },
    { parsedVersion: { major: 11, minor: 23, patch: 1, betaText: '-beta', betaIndex: 1 },             rawVersion: '11.23.1-beta-1', isValid: true },
    { parsedVersion: { major: 11, minor: 23, patch: 1, betaText: undefined, betaIndex: undefined },   rawVersion: '11.23.1',        isValid: true },

    { parsedVersion: { major: 12, minor: 10, patch: 1, betaText: undefined, betaIndex: undefined },   rawVersion: '12.10.1',        isValid: true },
  ];

  const testCases: TestCase[] = [
    { 
      current: '11.20.3',
      expectedTarget: { version: { major: 11, minor: 20, patch: 3, betaText: undefined, betaIndex: undefined },  description: TargetVersionDescription.LOCAL_VERSION },
      expectedNew: '11.21.0' 
    },
    { 
      current: '11.20.3-beta.1',
      expectedTarget: { version: { major: 11, minor: 20, patch: 3, betaText: '-beta', betaIndex: 1 },          description: TargetVersionDescription.LOCAL_VERSION },
      expectedNew: '11.21.0' 
    },
    { 
      current: '11.21.3',
      expectedTarget: { version: { major: 11, minor: 23, patch: 1, betaText: undefined, betaIndex: undefined },  description: TargetVersionDescription.LATEST_PUBLISHED_MINOR_VERSION },
      expectedNew: '11.24.0' 
    },
    { 
      current: '11.21.3-beta.2',
      expectedTarget: { version: { major: 11, minor: 23, patch: 1, betaText: undefined, betaIndex: undefined },  description: TargetVersionDescription.LATEST_PUBLISHED_MINOR_VERSION },
      expectedNew: '11.24.0' 
    },
    { 
      current: '11.22.1',
      expectedTarget: { version: { major: 11, minor: 23, patch: 1, betaText: undefined, betaIndex: undefined },  description: TargetVersionDescription.LATEST_PUBLISHED_MINOR_VERSION },
      expectedNew: '11.24.0' 
    },
    { 
      current: '11.22.1-beta.3',
      expectedTarget: { version: { major: 11, minor: 23, patch: 1, betaText: undefined, betaIndex: undefined },  description: TargetVersionDescription.LATEST_PUBLISHED_MINOR_VERSION },
      expectedNew: '11.24.0' 
    },
    { 
      current: '11.23.10',
      expectedTarget: { version: { major: 11, minor: 23, patch: 10, betaText: undefined, betaIndex: undefined }, description: TargetVersionDescription.LOCAL_VERSION },
      expectedNew: '11.24.0' 
    },
    { 
      current: '11.23.10-beta.4',
      expectedTarget: { version: { major: 11, minor: 23, patch: 10, betaText: '-beta', betaIndex: 4 },         description: TargetVersionDescription.LOCAL_VERSION },
      expectedNew: '11.24.0' 
    },
    { 
      current: '11.24.2',
      expectedTarget: { version: { major: 11, minor: 24, patch: 2, betaText: undefined, betaIndex: undefined },  description: TargetVersionDescription.LOCAL_VERSION },
      expectedNew: '11.25.0' 
    },
    { 
      current: '11.24.2-beta.5',
      expectedTarget: { version: { major: 11, minor: 24, patch: 2, betaText: '-beta', betaIndex: 5 },          description: TargetVersionDescription.LOCAL_VERSION },
      expectedNew: '11.25.0' 
    },
  ];

  testCases.forEach((t) => {
    const provider = new MinorVersionProvider(t.current, publishedVersions, '-beta');
    const tvInfo = provider.getTargetVersionInfo();
    expect(tvInfo).toStrictEqual(t.expectedTarget);

    const newVersion = provider.getNewVersionString();
    expect(newVersion).toBe(t.expectedNew);
  });
});

it('returns target version and new version with published version info (case with latest beta)', () => {
  const publishedVersions: PackageVersionInfo[] = [
    { parsedVersion: { major: 10, minor: 2, patch: 74, betaText: undefined, betaIndex: undefined },   rawVersion: '10.2.74',        isValid: true },
    { parsedVersion: { major: 11, minor: 22, patch: 4, betaText: undefined, betaIndex: undefined },   rawVersion: '11.22.4',        isValid: true },
    { parsedVersion: { major: 11, minor: 22, patch: 6, betaText: undefined, betaIndex: undefined },   rawVersion: '11.22.6',        isValid: true },
    { parsedVersion: { major: 11, minor: 22, patch: 8, betaText: undefined, betaIndex: undefined },   rawVersion: '11.22.8',        isValid: true },

    { parsedVersion: { major: 11, minor: 23, patch: 0, betaText: undefined, betaIndex: undefined },   rawVersion: '11.23.0',        isValid: true },
    { parsedVersion: { major: 11, minor: 23, patch: 1, betaText: '-beta', betaIndex: 1 },             rawVersion: '11.23.1-beta-1', isValid: true },
    { parsedVersion: { major: 11, minor: 23, patch: 1, betaText: '-beta', betaIndex: 3 },             rawVersion: '11.23.1-beta-3', isValid: true },

    { parsedVersion: { major: 12, minor: 10, patch: 1, betaText: undefined, betaIndex: undefined },   rawVersion: '12.10.1',        isValid: true },
  ];

  const testCases: TestCase[] = [
    { 
      current: '11.20.3',
      expectedTarget: { version: { major: 11, minor: 20, patch: 3, betaText: undefined, betaIndex: undefined },  description: TargetVersionDescription.LOCAL_VERSION },
      expectedNew: '11.21.0' 
    },
    { 
      current: '11.20.3-beta.1',
      expectedTarget: { version: { major: 11, minor: 20, patch: 3, betaText: '-beta', betaIndex: 1 },          description: TargetVersionDescription.LOCAL_VERSION },
      expectedNew: '11.21.0' 
    },
    { 
      current: '11.21.3',
      expectedTarget: { version: { major: 11, minor: 23, patch: 1, betaText: '-beta', betaIndex: 3 },          description: TargetVersionDescription.LATEST_PUBLISHED_BETA_VERSION },
      expectedNew: '11.24.0' 
    },
    { 
      current: '11.21.3-beta.2',
      expectedTarget: { version: { major: 11, minor: 23, patch: 1, betaText: '-beta', betaIndex: 3 },          description: TargetVersionDescription.LATEST_PUBLISHED_BETA_VERSION },
      expectedNew: '11.24.0' 
    },
    { 
      current: '11.22.1',
      expectedTarget: { version: { major: 11, minor: 23, patch: 1, betaText: '-beta', betaIndex: 3 },          description: TargetVersionDescription.LATEST_PUBLISHED_BETA_VERSION },
      expectedNew: '11.24.0' 
    },
    { 
      current: '11.22.1-beta.3',
      expectedTarget: { version: { major: 11, minor: 23, patch: 1, betaText: '-beta', betaIndex: 3 },          description: TargetVersionDescription.LATEST_PUBLISHED_BETA_VERSION },
      expectedNew: '11.24.0' 
    },
    { 
      current: '11.23.10',
      expectedTarget: { version: { major: 11, minor: 23, patch: 10, betaText: undefined, betaIndex: undefined }, description: TargetVersionDescription.LOCAL_VERSION },
      expectedNew: '11.24.0' 
    },
    { 
      current: '11.23.10-beta.4',
      expectedTarget: { version: { major: 11, minor: 23, patch: 10, betaText: '-beta', betaIndex: 4 },         description: TargetVersionDescription.LOCAL_VERSION },
      expectedNew: '11.24.0' 
    },
    { 
      current: '11.24.2',
      expectedTarget: { version: { major: 11, minor: 24, patch: 2, betaText: undefined, betaIndex: undefined },  description: TargetVersionDescription.LOCAL_VERSION },
      expectedNew: '11.25.0' 
    },
    { 
      current: '11.24.2-beta.5',
      expectedTarget: { version: { major: 11, minor: 24, patch: 2, betaText: '-beta', betaIndex: 5 },          description: TargetVersionDescription.LOCAL_VERSION },
      expectedNew: '11.25.0' 
    },
  ];

  testCases.forEach((t) => {
    const provider = new MinorVersionProvider(t.current, publishedVersions, '-beta');
    const tvInfo = provider.getTargetVersionInfo();
    expect(tvInfo).toStrictEqual(t.expectedTarget);

    const newVersion = provider.getNewVersionString();
    expect(newVersion).toBe(t.expectedNew);
  });
});
