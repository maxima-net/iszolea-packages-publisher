import PatchVersionProvider from './patch-version-provider';

it('returns new version correctly', () => {
  let provider = new PatchVersionProvider('1.2.3');
  let newVersion = provider.getNewVersionString();
  expect(newVersion).toBe('1.2.4');

  provider = new PatchVersionProvider('10.12.2-beta.4');
  newVersion = provider.getNewVersionString();
  expect(newVersion).toBe('10.12.2');
});
