import { VersionProvider } from '.';
import VersionProviderBase from './version-provider-base';

export default class BetaVersionProvider extends VersionProviderBase implements VersionProvider {
  getName(): string {
    return 'Beta';
  }
    
  isCustom(): boolean {
    return false;
  }

  getNewVersion(): string | undefined {
    const vi = this.versionInfo;
    if (!vi) {
      return undefined;
    }

    const prefix = `${vi.major}.${vi.minor}`; 
    let path = vi.patch;
    let suffix = vi.suffix;

    if(!vi.suffix) {
      path = vi.patch + 1;
      suffix = 'beta.1';
    }
    else {
      const regex = /beta.(\d+)/;
      const match = vi.suffix.match(regex);

      if(!match || match.length < 2) {
        return undefined;
      }

      const index = +match[1];
      suffix = `beta.${index + 1}`;
    }

    return `${prefix}.${path}-${suffix}`;
  }
}
