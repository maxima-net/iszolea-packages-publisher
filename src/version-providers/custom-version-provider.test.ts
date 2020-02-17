import CustomVersionProvider from './custom-version-provider';

it('returns new version correctly', () => {
  let provider = new CustomVersionProvider('11.22.3');
  let newVersion = provider.getNewVersionString();
  expect(newVersion).toBe('');

  provider = new CustomVersionProvider('11.22.4-beta.1');
  newVersion = provider.getNewVersionString();
  expect(newVersion).toBe('');

  provider = new CustomVersionProvider('');
  newVersion = provider.getNewVersionString();
  expect(newVersion).toBe('');

  provider = new CustomVersionProvider('abcde');
  newVersion = provider.getNewVersionString();
  expect(newVersion).toBe('');
});
