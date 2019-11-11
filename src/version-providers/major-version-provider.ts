import { VersionProvider, IszoleaVersionInfo } from '.';
import VersionProviderBase from './version-provider-base';

export default class MajorVersionProvider extends VersionProviderBase implements VersionProvider {
  getName(): string {
    return 'Major';
  }
    
  isCustom(): boolean {
    return false;
  }

  getNewVersion(): IszoleaVersionInfo | undefined {
    const vi = this.versionInfo;
    
    if (!vi) {
      return undefined;
    }

    return {
      major: vi.major + 1,
      minor: 0,
      patch: 0,
      betaIndex: undefined
    };
  }
}
