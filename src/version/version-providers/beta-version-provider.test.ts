import BetaVersionProvider from './beta-version-provider';
import { PackageVersionInfo } from '../nuget-versions-parser';

it('returns new version correctly', () => {
  let provider = new BetaVersionProvider('11.22.3', []);
  let newVersion = provider.getNewVersionString();
  expect(newVersion).toBe('11.22.4-beta.1');

  provider = new BetaVersionProvider('11.22.4-beta.1', []);
  newVersion = provider.getNewVersionString();
  expect(newVersion).toBe('11.22.4-beta.2');

  provider = new BetaVersionProvider('11.22.4-beta.13', []);
  newVersion = provider.getNewVersionString();
  expect(newVersion).toBe('11.22.4-beta.14');
});

it('returns new version when next increment version is already published', () => {
  const publishedVersions: PackageVersionInfo[] = [
    { parsedVersion: { major: 11, minor: 22, patch: 4, betaIndex: undefined }, rawVersion: '11.22.4', isValid: true },

    { parsedVersion: { major: 11, minor: 22, patch: 5, betaIndex: 1 }, rawVersion: '11.22.5-beta-1', isValid: true },
    { parsedVersion: { major: 11, minor: 22, patch: 5, betaIndex: 2 }, rawVersion: '11.22.5-beta-2', isValid: true },
    { parsedVersion: { major: 11, minor: 22, patch: 5, betaIndex: undefined }, rawVersion: '11.22.5', isValid: true },

    { parsedVersion: { major: 11, minor: 22, patch: 6, betaIndex: undefined }, rawVersion: '11.22.6', isValid: true }
  ];

  let provider = new BetaVersionProvider('11.22.3', publishedVersions);
  let newVersion = provider.getNewVersionString();
  expect(newVersion).toBe('11.22.7-beta.1');

  provider = new BetaVersionProvider('11.22.4', publishedVersions);
  newVersion = provider.getNewVersionString();
  expect(newVersion).toBe('11.22.7-beta.1');

  provider = new BetaVersionProvider('11.22.5', publishedVersions);
  newVersion = provider.getNewVersionString();
  expect(newVersion).toBe('11.22.5-beta.3');

  provider = new BetaVersionProvider('11.22.6', publishedVersions);
  newVersion = provider.getNewVersionString();
  expect(newVersion).toBe('11.22.7-beta.1');
});

it('returns target version', () => {
  const testCases = [
    { currentVersion: '11.22.5',        expectedTargetVersion: { major: 11, minor: 22, patch: 5, suffix: undefined } },
    { currentVersion: '11.22.5-beta.1', expectedTargetVersion: { major: 11, minor: 22, patch: 5, suffix: 'beta.1' } },
    { currentVersion: '11.22.5-beta.3', expectedTargetVersion: { major: 11, minor: 22, patch: 5, suffix: 'beta.3' } },
  ];

  testCases.forEach((t) => {
    const provider = new BetaVersionProvider(t.currentVersion, []);
    const targetVersion = provider.getTargetVersion();
    expect(targetVersion).toStrictEqual(t.expectedTargetVersion);
  });
});


it('returns target version for next beta index with published version info', () => {
  const publishedVersions: PackageVersionInfo[] = [
    { parsedVersion: { major: 11, minor: 22, patch: 4, betaIndex: undefined }, rawVersion: '11.22.4', isValid: true },

    { parsedVersion: { major: 11, minor: 22, patch: 5, betaIndex: 1 }, rawVersion: '11.22.5-beta-1', isValid: true },
    { parsedVersion: { major: 11, minor: 22, patch: 5, betaIndex: 2 }, rawVersion: '11.22.5-beta-2', isValid: true },
    { parsedVersion: { major: 11, minor: 22, patch: 5, betaIndex: undefined }, rawVersion: '11.22.5', isValid: true },

    { parsedVersion: { major: 11, minor: 22, patch: 6, betaIndex: 1 }, rawVersion: '11.22.6-beta-1', isValid: true },
    { parsedVersion: { major: 11, minor: 22, patch: 6, betaIndex: undefined }, rawVersion: '11.22.6', isValid: true },

    { parsedVersion: { major: 11, minor: 22, patch: 8, betaIndex: undefined }, rawVersion: '11.22.8', isValid: true }
  ];

  const testCases = [
    { currentVersion: '11.22.3-beta.1', expectedTargetVersion: { major: 11, minor: 22, patch: 3, suffix: 'beta.1' } },
    { currentVersion: '11.22.4-beta.1', expectedTargetVersion: { major: 11, minor: 22, patch: 4, suffix: 'beta.1' } },
    { currentVersion: '11.22.5-beta.1', expectedTargetVersion: { major: 11, minor: 22, patch: 5, suffix: 'beta.2' } },
    { currentVersion: '11.22.6-beta.1', expectedTargetVersion: { major: 11, minor: 22, patch: 6, suffix: 'beta.1' } },
    { currentVersion: '11.22.7-beta.1', expectedTargetVersion: { major: 11, minor: 22, patch: 7, suffix: 'beta.1' } },
    { currentVersion: '11.22.8-beta.1', expectedTargetVersion: { major: 11, minor: 22, patch: 8, suffix: 'beta.1' } },
  ];

  testCases.forEach((t) => {
    const provider = new BetaVersionProvider(t.currentVersion, publishedVersions);
    const targetVersion = provider.getTargetVersion();
    expect(targetVersion).toStrictEqual(t.expectedTargetVersion);
  });
});
