import { VersionHelper } from './version-helper';

it('validates versions correctly', () => {
  let result = VersionHelper.validateVersion('1.19.10-beta.1');
  expect(result.isValid).toBe(true);
  expect(result.packageVersionError).toBeUndefined();
  
  result = VersionHelper.validateVersion('2.20.3');
  expect(result.isValid).toBe(true);
  expect(result.packageVersionError).toBeUndefined();
  

  result = VersionHelper.validateVersion('');
  expect(result.isValid).toBe(false);
  expect(result.packageVersionError).toBeDefined();

  result = VersionHelper.validateVersion('1.19.10-betas.1');
  expect(result.isValid).toBe(false);
  expect(result.packageVersionError).toBeDefined();

  result = VersionHelper.validateVersion('abc');
  expect(result.isValid).toBe(false);
  expect(result.packageVersionError).toBeDefined();

  result = VersionHelper.validateVersion('1.1911');
  expect(result.isValid).toBe(false);
  expect(result.packageVersionError).toBeDefined();
});

it('generates file and assembly versions correctly', () => {
  expect(VersionHelper.getFileAndAssemblyVersion('1.19.10-beta.1')).toBe('1.19.10.1');
  expect(VersionHelper.getFileAndAssemblyVersion('1.2.3-beta.345')).toBe('1.2.3.345');
  expect(VersionHelper.getFileAndAssemblyVersion('2.3.6')).toBe('2.3.6');
  expect(VersionHelper.getFileAndAssemblyVersion('2.abcf6')).toBeUndefined();
});
