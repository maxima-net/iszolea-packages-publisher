import CustomVersionProvider from '../custom-version-provider';

it('returns new version correctly', () => {
  let provider = new CustomVersionProvider('11.22.3', [], '-beta');
  let newVersion = provider.getNewVersionString();
  expect(newVersion).toBe('');

  provider = new CustomVersionProvider('11.22.4-beta.1', [], '-beta');
  newVersion = provider.getNewVersionString();
  expect(newVersion).toBe('');

  provider = new CustomVersionProvider('', [], '-beta');
  newVersion = provider.getNewVersionString();
  expect(newVersion).toBe('');

  provider = new CustomVersionProvider('abcde', [], '-beta');
  newVersion = provider.getNewVersionString();
  expect(newVersion).toBe('');
});
