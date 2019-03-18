import MinorVersionProvider from './minor-version-provider';

it('returns new version correctly', () => {
  let provider = new MinorVersionProvider('1.2.3');
  let newVersion = provider.getNewVersion();
  expect(newVersion).toBe('1.3.0');

  provider = new MinorVersionProvider('10.12.2-beta.4');
  newVersion = provider.getNewVersion();
  expect(newVersion).toBe('10.13.0');
});
