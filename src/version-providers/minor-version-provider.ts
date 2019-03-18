import { VersionProvider } from '.';
import VersionProviderBase from './version-provider-base';

export default class MinorVersionProvider extends VersionProviderBase implements VersionProvider {
  getName(): string {
    return 'Minor';
  }
    
  isCustom(): boolean {
    return false;
  }

  getNewVersion(): string | undefined {
    const vi = this.versionInfo;

    if (!vi) {
      return undefined;
    }

    return `${vi.major}.${vi.minor + 1}.0`;
  }
}
