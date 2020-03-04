import { VersionProvider } from '.';
import VersionProviderBase from './version-provider-base';
import { IszoleaVersionInfo } from '../version/version';


export default class MinorVersionProvider extends VersionProviderBase implements VersionProvider {
  getName(): string {
    return 'Minor';
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
      major: vi.major,
      minor: vi.minor + 1,
      patch: 0,
      betaIndex: undefined      
    };
  }
}
