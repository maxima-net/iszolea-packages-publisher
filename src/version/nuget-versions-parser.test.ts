import { PackageVersionInfo, parseVersionsList } from './nuget-versions-parser';

it('parses npm version list', () => {
  const rawVersions = `
  ISOZ.Claims 2.0.11
  ISOZ.Claims 2.0.10-beta.1
  ISOZ.Claims 2.0.9-beta1
  ISOZ.Claims 2.0.9.1`;

  const expectedResult: PackageVersionInfo[] = [
    { isValid: true, rawVersion: '2.0.11', parsedVersion: { major: 2, minor: 0, patch: 11, betaIndex: undefined } },
    { isValid: true, rawVersion: '2.0.10-beta.1', parsedVersion: { major: 2, minor: 0, patch: 10, betaIndex: 1 } },
    { isValid: false, rawVersion: '2.0.9-beta1', parsedVersion: { major: 2, minor: 0, patch: 9, betaIndex: 1 } },
    { isValid: false, rawVersion: '2.0.9.1', parsedVersion: undefined },
  ];

  const result = parseVersionsList(rawVersions, 'ISOZ.Claims');

  expect(result).toStrictEqual(expectedResult);
});

it('parses npm version list with inappropriate packages', () => {
  const rawVersions = `
  ISOZ.Licence 1.1.1
  ISOZ.Licence 1.0.0
  ISOZ.Licence.Signer 1.1.0`;

  const expectedResult: PackageVersionInfo[] = [
    { isValid: true, rawVersion: '1.1.1', parsedVersion: { major: 1, minor: 1, patch: 1, betaIndex: undefined } },
    { isValid: true, rawVersion: '1.0.0', parsedVersion: { major: 1, minor: 0, patch: 0, betaIndex: undefined } }
  ];

  const result = parseVersionsList(rawVersions, 'ISOZ.Licence');

  expect(result).toStrictEqual(expectedResult);
});

it('parses npm version list for nonexistent package', () => {
  const rawVersions = 'No packages found.';

  const expectedResult: PackageVersionInfo[] = [];

  const result = parseVersionsList(rawVersions, 'ISOZ.Licence');

  expect(result).toStrictEqual(expectedResult);
});
