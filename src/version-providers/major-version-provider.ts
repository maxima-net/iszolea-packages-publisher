import { VersionProvider } from '.';
import VersionProviderBase from './version-provider-base';

export default class MajorVersionProvider extends VersionProviderBase implements VersionProvider {
  getName(): string {
    return 'Major';
  }
    
  isCustom(): boolean {
    return false;
  }

  getNewVersion(): string | undefined {
    const vi = this.versionInfo;
    
    if (!vi) {
      return undefined;
    }

    return `${vi.major + 1}.0.0`;
  }
}
