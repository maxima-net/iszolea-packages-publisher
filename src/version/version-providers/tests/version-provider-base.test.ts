import VersionProviderBase from '../version-provider-base';
import { IszoleaVersionInfo } from '../../version';

class TestVersionProviderBase extends VersionProviderBase {
  getName(): string {
    throw new Error('Method not implemented.');
  }
  isCustom(): boolean {
    throw new Error('Method not implemented.');
  }
  getNewVersion(): IszoleaVersionInfo | undefined {
    throw new Error('Method not implemented.');
  }
  protected getTargetVersion(): IszoleaVersionInfo | undefined {
    throw new Error('Method not implemented.');
  }
}

it('parses version correctly ', () => {
  let provider = new TestVersionProviderBase('1.2.3', []);

  let expectedResult: IszoleaVersionInfo = {
    major: 1,
    minor: 2,
    patch: 3,
    betaIndex: undefined
  };
  expect(provider.versionInfo).toEqual(expectedResult);

  provider = new TestVersionProviderBase('6.11.1234', []);
  expectedResult = {
    major: 6,
    minor: 11,
    patch: 1234,
    betaIndex: undefined
  };
  expect(provider.versionInfo).toEqual(expectedResult);

  provider = new TestVersionProviderBase('1.10.2-beta.2', []);
  expectedResult = {
    major: 1,
    minor: 10,
    patch: 2,
    betaIndex: 2
  };
  expect(provider.versionInfo).toEqual(expectedResult);

  provider = new TestVersionProviderBase('1.10', []);
  expect(provider.versionInfo).toBeUndefined();
});
