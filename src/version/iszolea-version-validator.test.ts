import IszoleaVersionValidator from './iszolea-version-validator';

it('validates versions correctly', () => {
  const validator = new IszoleaVersionValidator();

  let result = validator.validate('1.19.10-beta.1');
  expect(result.isValid).toBe(true);
  expect(result.packageVersionError).toBeUndefined();
  
  result = validator.validate('2.20.3');
  expect(result.isValid).toBe(true);
  expect(result.packageVersionError).toBeUndefined();

  result = validator.validate('');
  expect(result.isValid).toBe(false);
  expect(result.packageVersionError).toBeDefined();

  result = validator.validate('1.19.10-betas.1');
  expect(result.isValid).toBe(true);
  expect(result.packageVersionError).toBeUndefined();

  result = validator.validate('abc');
  expect(result.isValid).toBe(false);
  expect(result.packageVersionError).toBeDefined();

  result = validator.validate('1.1911');
  expect(result.isValid).toBe(false);
  expect(result.packageVersionError).toBeDefined();
});
