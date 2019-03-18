import BetaVersionProvider from './beta-version-provider';

it('returns new version correctly', () => {
  let provider = new BetaVersionProvider('11.22.3');
  let newVersion = provider.getNewVersionString();
  expect(newVersion).toBe('11.22.4-beta.1');

  provider = new BetaVersionProvider('11.22.4-beta.1');
  newVersion = provider.getNewVersionString();
  expect(newVersion).toBe('11.22.4-beta.2');

  provider = new BetaVersionProvider('11.22.4-beta.13');
  newVersion = provider.getNewVersionString();
  expect(newVersion).toBe('11.22.4-beta.14');
});
