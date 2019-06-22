import { validateVersion, getFileAndAssemblyVersion } from './version';

it('validates versions correctly', () => {
  let result = validateVersion('1.19.10-beta.1');
  expect(result.isValid).toBe(true);
  expect(result.packageVersionError).toBeUndefined();
  
  result = validateVersion('2.20.3');
  expect(result.isValid).toBe(true);
  expect(result.packageVersionError).toBeUndefined();
  

  result = validateVersion('');
  expect(result.isValid).toBe(false);
  expect(result.packageVersionError).toBeDefined();

  result = validateVersion('1.19.10-betas.1');
  expect(result.isValid).toBe(false);
  expect(result.packageVersionError).toBeDefined();

  result = validateVersion('abc');
  expect(result.isValid).toBe(false);
  expect(result.packageVersionError).toBeDefined();

  result = validateVersion('1.1911');
  expect(result.isValid).toBe(false);
  expect(result.packageVersionError).toBeDefined();
});

it('generates file and assembly versions correctly', () => {
  expect(getFileAndAssemblyVersion('1.19.10-beta.1')).toBe('1.19.10.1');
  expect(getFileAndAssemblyVersion('1.2.3-beta.345')).toBe('1.2.3.345');
  expect(getFileAndAssemblyVersion('2.3.6')).toBe('2.3.6');
  expect(getFileAndAssemblyVersion('2.abcf6')).toBeUndefined();
});
