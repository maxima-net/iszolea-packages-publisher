import MajorVersionProvider from './major-version-provider';

it('returns new version correctly', () => {
  let provider = new MajorVersionProvider('1.2.3');
  let newVersion = provider.getNewVersionString();
  expect(newVersion).toBe('2.0.0');

  provider = new MajorVersionProvider('10.12.2-beta.4');
  newVersion = provider.getNewVersionString();
  expect(newVersion).toBe('11.0.0');
});
