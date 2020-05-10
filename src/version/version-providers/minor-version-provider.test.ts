import MinorVersionProvider from './minor-version-provider';
import { TestCase, TargetVersionDescription } from '.';
import { PackageVersionInfo } from '../nuget-versions-parser';

it('returns target version and new version', () => {
  const testCases: TestCase[] = [
    { 
      current: '1.2.3',
      expectedTarget: { version: { major: 1, minor: 2, patch: 3, suffix: undefined }, description: TargetVersionDescription.LOCAL_VERSION },
      expectedNew: '1.3.0' 
    },
    { 
      current: '10.12.2-beta.4',
      expectedTarget: { version: { major: 10, minor: 12, patch: 2, suffix: 'beta.4' }, description: TargetVersionDescription.LOCAL_VERSION },
      expectedNew: '10.13.0'
    }
  ];
  
  testCases.forEach((t) => {
    const provider = new MinorVersionProvider(t.current, []);
    const tvInfo = provider.getTargetVersion();
    expect(tvInfo).toStrictEqual(t.expectedTarget);

    const newVersion = provider.getNewVersionString();
    expect(newVersion).toBe(t.expectedNew);
  });
});

it('returns target version and new version with published version info', () => {
  const publishedVersions: PackageVersionInfo[] = [
    { parsedVersion: { major: 10, minor: 2, patch: 74, betaIndex: undefined },  rawVersion: '10.2.74',        isValid: true },
    { parsedVersion: { major: 11, minor: 22, patch: 4, betaIndex: undefined },  rawVersion: '11.22.4',        isValid: true },
    { parsedVersion: { major: 11, minor: 22, patch: 6, betaIndex: undefined },  rawVersion: '11.22.6',        isValid: true },
    { parsedVersion: { major: 11, minor: 22, patch: 8, betaIndex: undefined },  rawVersion: '11.22.8',        isValid: true },

    { parsedVersion: { major: 11, minor: 23, patch: 0, betaIndex: undefined },  rawVersion: '11.23.0',        isValid: true },
    { parsedVersion: { major: 11, minor: 23, patch: 1, betaIndex: 1 },          rawVersion: '11.23.1-beta-1', isValid: true },
    { parsedVersion: { major: 11, minor: 23, patch: 1, betaIndex: undefined },  rawVersion: '11.23.1',        isValid: true },

    { parsedVersion: { major: 12, minor: 10, patch: 1, betaIndex: undefined },  rawVersion: '12.10.1',        isValid: true },
  ];

  const testCases: TestCase[] = [
    { 
      current: '11.20.3',
      expectedTarget: { version: { major: 11, minor: 20, patch: 3, suffix: undefined }, description: TargetVersionDescription.LOCAL_VERSION },
      expectedNew: '11.21.0' 
    },
    { 
      current: '11.20.3-beta.1',
      expectedTarget: { version: { major: 11, minor: 20, patch: 3, suffix: 'beta.1' }, description: TargetVersionDescription.LOCAL_VERSION },
      expectedNew: '11.21.0' 
    },
    { 
      current: '11.21.3',
      expectedTarget: { version: { major: 11, minor: 23, patch: 1, suffix: undefined }, description: TargetVersionDescription.LATEST_PUBLISHED_MINOR_VERSION },
      expectedNew: '11.24.0' 
    },
    { 
      current: '11.21.3-beta.2',
      expectedTarget: { version: { major: 11, minor: 23, patch: 1, suffix: undefined }, description: TargetVersionDescription.LATEST_PUBLISHED_MINOR_VERSION },
      expectedNew: '11.24.0' 
    },
    { 
      current: '11.22.1',
      expectedTarget: { version: { major: 11, minor: 23, patch: 1, suffix: undefined }, description: TargetVersionDescription.LATEST_PUBLISHED_MINOR_VERSION },
      expectedNew: '11.24.0' 
    },
    { 
      current: '11.22.1-beta.3',
      expectedTarget: { version: { major: 11, minor: 23, patch: 1, suffix: undefined }, description: TargetVersionDescription.LATEST_PUBLISHED_MINOR_VERSION },
      expectedNew: '11.24.0' 
    },
    { 
      current: '11.23.10',
      expectedTarget: { version: { major: 11, minor: 23, patch: 10, suffix: undefined }, description: TargetVersionDescription.LOCAL_VERSION },
      expectedNew: '11.24.0' 
    },
    { 
      current: '11.23.10-beta.4',
      expectedTarget: { version: { major: 11, minor: 23, patch: 10, suffix: 'beta.4' }, description: TargetVersionDescription.LOCAL_VERSION },
      expectedNew: '11.24.0' 
    },
    { 
      current: '11.24.2',
      expectedTarget: { version: { major: 11, minor: 24, patch: 2, suffix: undefined }, description: TargetVersionDescription.LOCAL_VERSION },
      expectedNew: '11.25.0' 
    },
    { 
      current: '11.24.2-beta.5',
      expectedTarget: { version: { major: 11, minor: 24, patch: 2, suffix: 'beta.5'}, description: TargetVersionDescription.LOCAL_VERSION },
      expectedNew: '11.25.0' 
    },
  ];

  testCases.forEach((t) => {
    const provider = new MinorVersionProvider(t.current, publishedVersions);
    const tvInfo = provider.getTargetVersion();
    expect(tvInfo).toStrictEqual(t.expectedTarget);

    const newVersion = provider.getNewVersionString();
    expect(newVersion).toBe(t.expectedNew);
  });
});

it('returns target version and new version with published version info (case with latest beta)', () => {
  const publishedVersions: PackageVersionInfo[] = [
    { parsedVersion: { major: 10, minor: 2, patch: 74, betaIndex: undefined },  rawVersion: '10.2.74',        isValid: true },
    { parsedVersion: { major: 11, minor: 22, patch: 4, betaIndex: undefined },  rawVersion: '11.22.4',        isValid: true },
    { parsedVersion: { major: 11, minor: 22, patch: 6, betaIndex: undefined },  rawVersion: '11.22.6',        isValid: true },
    { parsedVersion: { major: 11, minor: 22, patch: 8, betaIndex: undefined },  rawVersion: '11.22.8',        isValid: true },

    { parsedVersion: { major: 11, minor: 23, patch: 0, betaIndex: undefined },  rawVersion: '11.23.0',        isValid: true },
    { parsedVersion: { major: 11, minor: 23, patch: 1, betaIndex: 1 },          rawVersion: '11.23.1-beta-1', isValid: true },
    { parsedVersion: { major: 11, minor: 23, patch: 1, betaIndex: 3 },          rawVersion: '11.23.1-beta-3', isValid: true },

    { parsedVersion: { major: 12, minor: 10, patch: 1, betaIndex: undefined },  rawVersion: '12.10.1',        isValid: true },
  ];

  const testCases: TestCase[] = [
    { 
      current: '11.20.3',
      expectedTarget: { version: { major: 11, minor: 20, patch: 3, suffix: undefined }, description: TargetVersionDescription.LOCAL_VERSION },
      expectedNew: '11.21.0' 
    },
    { 
      current: '11.20.3-beta.1',
      expectedTarget: { version: { major: 11, minor: 20, patch: 3, suffix: 'beta.1' }, description: TargetVersionDescription.LOCAL_VERSION },
      expectedNew: '11.21.0' 
    },
    { 
      current: '11.21.3',
      expectedTarget: { version: { major: 11, minor: 23, patch: 1, suffix: 'beta.3' }, description: TargetVersionDescription.LATEST_PUBLISHED_MINOR_VERSION },
      expectedNew: '11.24.0' 
    },
    { 
      current: '11.21.3-beta.2',
      expectedTarget: { version: { major: 11, minor: 23, patch: 1, suffix: 'beta.3' }, description: TargetVersionDescription.LATEST_PUBLISHED_MINOR_VERSION },
      expectedNew: '11.24.0' 
    },
    { 
      current: '11.22.1',
      expectedTarget: { version: { major: 11, minor: 23, patch: 1, suffix: 'beta.3' }, description: TargetVersionDescription.LATEST_PUBLISHED_MINOR_VERSION },
      expectedNew: '11.24.0' 
    },
    { 
      current: '11.22.1-beta.3',
      expectedTarget: { version: { major: 11, minor: 23, patch: 1, suffix: 'beta.3' }, description: TargetVersionDescription.LATEST_PUBLISHED_MINOR_VERSION },
      expectedNew: '11.24.0' 
    },
    { 
      current: '11.23.10',
      expectedTarget: { version: { major: 11, minor: 23, patch: 10, suffix: undefined }, description: TargetVersionDescription.LOCAL_VERSION },
      expectedNew: '11.24.0' 
    },
    { 
      current: '11.23.10-beta.4',
      expectedTarget: { version: { major: 11, minor: 23, patch: 10, suffix: 'beta.4' }, description: TargetVersionDescription.LOCAL_VERSION },
      expectedNew: '11.24.0' 
    },
    { 
      current: '11.24.2',
      expectedTarget: { version: { major: 11, minor: 24, patch: 2, suffix: undefined }, description: TargetVersionDescription.LOCAL_VERSION },
      expectedNew: '11.25.0' 
    },
    { 
      current: '11.24.2-beta.5',
      expectedTarget: { version: { major: 11, minor: 24, patch: 2, suffix: 'beta.5'}, description: TargetVersionDescription.LOCAL_VERSION },
      expectedNew: '11.25.0' 
    },
  ];

  testCases.forEach((t) => {
    const provider = new MinorVersionProvider(t.current, publishedVersions);
    const tvInfo = provider.getTargetVersion();
    expect(tvInfo).toStrictEqual(t.expectedTarget);

    const newVersion = provider.getNewVersionString();
    expect(newVersion).toBe(t.expectedNew);
  });
});
