import { VersionProvider, IszoleaVersionInfo } from '.';
import VersionProviderBase from './version-provider-base';

export default class CustomVersionProvider extends VersionProviderBase implements VersionProvider {
  getName(): string {
    return 'Custom';
  }
  
  isCustom(): boolean {
    return true;
  }

  getNewVersion(): IszoleaVersionInfo | undefined {
    const vi = this.versionInfo;
    
    if(!vi) {
      return undefined;
    } 

    let betaIndex = undefined;

    if(vi.suffix) {
      const match = vi.suffix.match(/beta.(\d+)/);
      if(match && match.length >= 2) {
        betaIndex = +match[1];
      }
    }

    return {
      major: vi.major,
      minor: vi.minor,
      patch: vi.patch,
      betaIndex
    };
  }
}
