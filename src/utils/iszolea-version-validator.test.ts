import { IszoleaVersionValidator } from './iszolea-version-validator';

it('validate versions correctly', () => {
  let result = IszoleaVersionValidator.validateVersion('','');
  expect(result.isValid).toBe(false);
  expect(result.packageVersionError).toBeDefined();
  expect(result.fileAndAssemblyVersionError).toBeDefined();

  result = IszoleaVersionValidator.validateVersion('1.19.10-beta.1','1.19.10.1');
  expect(result.isValid).toBe(true);
  expect(result.packageVersionError).toBeUndefined();
  expect(result.fileAndAssemblyVersionError).toBeUndefined();

  
  result = IszoleaVersionValidator.validateVersion('2.20.3','2.20.3');
  expect(result.isValid).toBe(true);
  expect(result.packageVersionError).toBeUndefined();
  expect(result.fileAndAssemblyVersionError).toBeUndefined();

  result = IszoleaVersionValidator.validateVersion('2.20.3','2.21.4');
  expect(result.isValid).toBe(false);
  expect(result.packageVersionError).toBeUndefined();
  expect(result.fileAndAssemblyVersionError).toBeDefined();

  result = IszoleaVersionValidator.validateVersion('2.20.3','2.20.4')
  expect(result.isValid).toBe(false);
  expect(result.packageVersionError).toBeUndefined();
  expect(result.fileAndAssemblyVersionError).toBeDefined();

  result = IszoleaVersionValidator.validateVersion('2.21.3','2.20.3')
  expect(result.isValid).toBe(false);
  expect(result.packageVersionError).toBeUndefined();
  expect(result.fileAndAssemblyVersionError).toBeDefined();

  result = IszoleaVersionValidator.validateVersion('3.20.3','2.20.3')
  expect(result.isValid).toBe(false);
  expect(result.packageVersionError).toBeUndefined();
  expect(result.fileAndAssemblyVersionError).toBeDefined();

  result = IszoleaVersionValidator.validateVersion('1.19.10-beta.1','1.19.10.2'); 
  expect(result.isValid).toBe(false);
  expect(result.packageVersionError).toBeUndefined();
  expect(result.fileAndAssemblyVersionError).toBeDefined();

  result = IszoleaVersionValidator.validateVersion('1.19.10-beta.1','1.19.10');
  expect(result.isValid).toBe(false);
  expect(result.packageVersionError).toBeUndefined();
  expect(result.fileAndAssemblyVersionError).toBeDefined();

  result = IszoleaVersionValidator.validateVersion('abc','1.19.10');
  expect(result.isValid).toBe(false);
  expect(result.packageVersionError).toBeDefined();
  expect(result.fileAndAssemblyVersionError).toBeUndefined();

  result = IszoleaVersionValidator.validateVersion('1.19.10', 'avc');
  expect(result.isValid).toBe(false);
  expect(result.packageVersionError).toBeUndefined();
  expect(result.fileAndAssemblyVersionError).toBeDefined();

  result = IszoleaVersionValidator.validateVersion('1.1911', '1.1911');
  expect(result.isValid).toBe(false);
  expect(result.packageVersionError).toBeDefined();
  expect(result.fileAndAssemblyVersionError).toBeDefined();
})
