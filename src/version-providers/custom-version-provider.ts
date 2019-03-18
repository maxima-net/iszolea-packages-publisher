import { VersionProvider } from '.';
import VersionProviderBase from './version-provider-base';

export default class CustomVersionProvider extends VersionProviderBase implements VersionProvider {
  getName(): string {
    return 'Custom';
  }
  
  isCustom(): boolean {
    return true;
  }

  getNewVersion(): string | undefined {
    const vi = this.versionInfo;
    
    if(!vi) {
      return '';
    } 

    const suffix = vi.suffix ? `-${vi.suffix}` : '';
    return `${vi.major}.${vi.minor}.${vi.patch}${suffix}`;
  }
}
