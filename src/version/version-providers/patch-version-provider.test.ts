import PatchVersionProvider from './patch-version-provider';
import { TestCase, TargetVersionDescription } from '.';

it('returns target version and new version', () => {
  const testCases: TestCase[] = [
    { 
      current: '1.2.3',
      expectedTarget: { version: { major: 1, minor: 2, patch: 3, suffix: undefined }, description: TargetVersionDescription.LOCAL_VERSION },
      expectedNew: '1.2.4' 
    },
    { 
      current: '10.12.2-beta.4',
      expectedTarget: { version: { major: 10, minor: 12, patch: 2, suffix: 'beta.4' }, description: TargetVersionDescription.LOCAL_VERSION },
      expectedNew: '10.12.2'
    }
  ];
  
  testCases.forEach((t) => {
    const provider = new PatchVersionProvider(t.current, []);
    const tvInfo = provider.getTargetVersion();
    expect(tvInfo).toStrictEqual(t.expectedTarget);

    const newVersion = provider.getNewVersionString();
    expect(newVersion).toBe(t.expectedNew);
  });
});
