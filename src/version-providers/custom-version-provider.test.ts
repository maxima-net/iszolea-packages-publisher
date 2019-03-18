import CustomVersionProvider from './custom-version-provider';

it('returns new version correctly', () => {
  let provider = new CustomVersionProvider('11.22.3');
  let newVersion = provider.getNewVersion();
  expect(newVersion).toBe('11.22.3');

  provider = new CustomVersionProvider('11.22.4-beta.1');
  newVersion = provider.getNewVersion();
  expect(newVersion).toBe('11.22.4-beta.1');

  provider = new CustomVersionProvider('');
  newVersion = provider.getNewVersion();
  expect(newVersion).toBe('');

  provider = new CustomVersionProvider('abcde');
  newVersion = provider.getNewVersion();
  expect(newVersion).toBe('');
});
