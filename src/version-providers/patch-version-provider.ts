import { VersionProvider } from '.';
import VersionProviderBase from './version-provider-base';

export default class PatchVersionProvider extends VersionProviderBase implements VersionProvider {
  getName(): string {
    return 'Patch';
  }
  
  isCustom(): boolean {
    return false;
  }

  getNewVersion(): string | undefined {
    const vi = this.versionInfo;

    if (!vi) {
      return undefined;
    }

    return `${vi.major}.${vi.minor}.${vi.patch + 1}`;
  }
}
