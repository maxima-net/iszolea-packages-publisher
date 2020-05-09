import BetaVersionProvider from './beta-version-provider';
import { PackageVersionInfo } from '../nuget-versions-parser';

it('returns target version and new version', () => {
  const testCases = [
    { currentVersion: '11.22.3', expectedTargetVersion: { major: 11, minor: 22, patch: 3, suffix: undefined }, expectedNewVersion: '11.22.4-beta.1' },
    { currentVersion: '11.22.4-beta.1', expectedTargetVersion: { major: 11, minor: 22, patch: 4, suffix: 'beta.1' }, expectedNewVersion: '11.22.4-beta.2' },
    { currentVersion: '11.22.4-beta.13', expectedTargetVersion: { major: 11, minor: 22, patch: 4, suffix: 'beta.13' }, expectedNewVersion: '11.22.4-beta.14' },
  ];
  
  testCases.forEach((t) => {
    const provider = new BetaVersionProvider(t.currentVersion, []);
    const targetVersion = provider.getTargetVersion();
    expect(targetVersion).toStrictEqual(t.expectedTargetVersion);

    const newVersion = provider.getNewVersionString();
    expect(newVersion).toBe(t.expectedNewVersion);
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

  const testCases = [
    { currentVersion: '11.22.3-beta.1', expectedTargetVersion: { major: 11, minor: 22, patch: 3, suffix: 'beta.1' }, expectedNewVersion: '11.22.3-beta.2' },
    { currentVersion: '11.22.4-beta.1', expectedTargetVersion: { major: 11, minor: 22, patch: 4, suffix: 'beta.1' }, expectedNewVersion: '11.22.4-beta.2' },

    { currentVersion: '11.22.5-beta.1', expectedTargetVersion: { major: 11, minor: 22, patch: 5, suffix: 'beta.2' }, expectedNewVersion: '11.22.5-beta.3' },
    { currentVersion: '11.22.5-beta.2', expectedTargetVersion: { major: 11, minor: 22, patch: 5, suffix: 'beta.2' }, expectedNewVersion: '11.22.5-beta.3' },
    { currentVersion: '11.22.5-beta.3', expectedTargetVersion: { major: 11, minor: 22, patch: 5, suffix: 'beta.3' }, expectedNewVersion: '11.22.5-beta.4' },

    { currentVersion: '11.22.6-beta.1', expectedTargetVersion: { major: 11, minor: 22, patch: 6, suffix: 'beta.1' }, expectedNewVersion: '11.22.6-beta.2' },
    { currentVersion: '11.22.7-beta.1', expectedTargetVersion: { major: 11, minor: 22, patch: 7, suffix: 'beta.1' }, expectedNewVersion: '11.22.7-beta.2' },
    { currentVersion: '11.22.8-beta.1', expectedTargetVersion: { major: 11, minor: 22, patch: 8, suffix: 'beta.1' }, expectedNewVersion: '11.22.8-beta.2' },
    { currentVersion: '11.22.9-beta.1', expectedTargetVersion: { major: 11, minor: 22, patch: 9, suffix: 'beta.1' }, expectedNewVersion: '11.22.9-beta.2' },
  ];

  testCases.forEach((t) => {
    const provider = new BetaVersionProvider(t.currentVersion, publishedVersions);
    const targetVersion = provider.getTargetVersion();
    expect(targetVersion).toStrictEqual(t.expectedTargetVersion);

    const newVersion = provider.getNewVersionString();
    expect(newVersion).toBe(t.expectedNewVersion);
  });
});

it('returns target version and new version for new beta with published version info', () => {
  const publishedVersions: PackageVersionInfo[] = [
    { parsedVersion: { major: 11, minor: 22, patch: 4, betaIndex: undefined },  rawVersion: '11.22.4',        isValid: true },

    { parsedVersion: { major: 11, minor: 22, patch: 5, betaIndex: 1 },          rawVersion: '11.22.5-beta-1', isValid: true },
    { parsedVersion: { major: 11, minor: 22, patch: 5, betaIndex: 2 },          rawVersion: '11.22.5-beta-2', isValid: true },
    { parsedVersion: { major: 11, minor: 22, patch: 5, betaIndex: undefined },  rawVersion: '11.22.5',        isValid: true },

    { parsedVersion: { major: 11, minor: 22, patch: 6, betaIndex: undefined },  rawVersion: '11.22.6',        isValid: true },

    { parsedVersion: { major: 11, minor: 22, patch: 8, betaIndex: undefined },  rawVersion: '11.22.8',        isValid: true },
  ];

  const testCases = [
    { currentVersion: '11.22.2', expectedTargetVersion: { major: 11, minor: 22, patch: 8, suffix: undefined },  expectedNewVersion: '11.22.9-beta.1' },
    { currentVersion: '11.22.3', expectedTargetVersion: { major: 11, minor: 22, patch: 8, suffix: undefined },  expectedNewVersion: '11.22.9-beta.1' },
    { currentVersion: '11.22.4', expectedTargetVersion: { major: 11, minor: 22, patch: 8, suffix: undefined },  expectedNewVersion: '11.22.9-beta.1' },
    { currentVersion: '11.22.5', expectedTargetVersion: { major: 11, minor: 22, patch: 5, suffix: 'beta.2' },   expectedNewVersion: '11.22.5-beta.3' },
    { currentVersion: '11.22.6', expectedTargetVersion: { major: 11, minor: 22, patch: 8, suffix: undefined },  expectedNewVersion: '11.22.9-beta.1' },
  ];

  testCases.forEach((t) => {
    const provider = new BetaVersionProvider(t.currentVersion, publishedVersions);
    const targetVersion = provider.getTargetVersion();
    expect(targetVersion).toStrictEqual(t.expectedTargetVersion);

    const newVersion = provider.getNewVersionString();
    expect(newVersion).toBe(t.expectedNewVersion);
  });
});
