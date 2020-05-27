import VersionProviderBase from '../version-provider-base';
import { VersionInfo } from '../../version';

class TestVersionProviderBase extends VersionProviderBase {
  getName(): string {
    throw new Error('Method not implemented.');
  }
  isCustom(): boolean {
    throw new Error('Method not implemented.');
  }
  getNewVersion(): VersionInfo | undefined {
    throw new Error('Method not implemented.');
  }
  protected getTargetVersion(): VersionInfo | undefined {
    throw new Error('Method not implemented.');
  }
}

it('parses version correctly ', () => {
  let provider = new TestVersionProviderBase('1.2.3', []);

  let expectedResult: VersionInfo = {
    major: 1,
    minor: 2,
    patch: 3,
    betaText: undefined,
    betaIndex: undefined
  };
  expect(provider.versionInfo).toEqual(expectedResult);

  provider = new TestVersionProviderBase('6.11.1234', []);
  expectedResult = {
    major: 6,
    minor: 11,
    patch: 1234,
    betaText: undefined,
    betaIndex: undefined
  };
  expect(provider.versionInfo).toEqual(expectedResult);

  provider = new TestVersionProviderBase('1.10.2-beta.2', []);
  expectedResult = {
    major: 1,
    minor: 10,
    patch: 2,
    betaText: '-beta',
    betaIndex: 2
  };
  expect(provider.versionInfo).toEqual(expectedResult);

  provider = new TestVersionProviderBase('1.10', []);
  expect(provider.versionInfo).toBeUndefined();
});
