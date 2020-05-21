import { parseVersionsList } from './npm-versions-parser';
import { PackageVersionInfo } from './nuget-versions-parser';

it('parses npm version list', () => {
  const rawVersions = `[ '0.0.1',
  '0.4.0-beta.8',
  '0.4.0-beta9',
  '0.4.0.9',
  '0.4.0' ]`;

  const expectedResult: PackageVersionInfo[] = [
    { isValid: true, rawVersion: '0.0.1',         parsedVersion: { major: 0, minor: 0, patch: 1, betaText: undefined, betaIndex: undefined } },
    { isValid: true, rawVersion: '0.4.0-beta.8',  parsedVersion: { major: 0, minor: 4, patch: 0, betaText: '-beta', betaIndex: 8 } },
    { isValid: false, rawVersion: '0.4.0-beta9',  parsedVersion: { major: 0, minor: 4, patch: 0, betaText: '-beta', betaIndex: 9 } },
    { isValid: false, rawVersion: '0.4.0.9',      parsedVersion: undefined },
    { isValid: true, rawVersion: '0.4.0',         parsedVersion: { major: 0, minor: 4, patch: 0, betaText: undefined, betaIndex: undefined } },
  ];

  const result = parseVersionsList(rawVersions);

  expect(result).toStrictEqual(expectedResult);
});

it('parses npm version list with multiple versions in a row', () => {
  const rawVersions = `[
    '0.0.49',         '0.0.50-beta.0',  '0.0.50-beta1',  '0.0.50',
    '0.4.0-beta.28'
  ]`;

  const expectedResult: PackageVersionInfo[] = [
    { isValid: true, rawVersion: '0.0.49',        parsedVersion: { major: 0, minor: 0, patch: 49, betaText: undefined, betaIndex: undefined } },
    { isValid: true, rawVersion: '0.0.50-beta.0', parsedVersion: { major: 0, minor: 0, patch: 50, betaText: '-beta', betaIndex: 0 } },
    { isValid: false, rawVersion: '0.0.50-beta1', parsedVersion: { major: 0, minor: 0, patch: 50, betaText: '-beta', betaIndex: 1 } },
    { isValid: true, rawVersion: '0.0.50',        parsedVersion: { major: 0, minor: 0, patch: 50, betaText: undefined, betaIndex: undefined } },
    { isValid: true, rawVersion: '0.4.0-beta.28', parsedVersion: { major: 0, minor: 4, patch: 0,  betaText: '-beta', betaIndex: 28 } },
  ];

  const result = parseVersionsList(rawVersions);

  expect(result).toStrictEqual(expectedResult);
});
