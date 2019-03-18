import { VersionProvider, IszoleaVersionInfo } from '.';
import VersionProviderBase from './version-provider-base';

export default class PatchVersionProvider extends VersionProviderBase implements VersionProvider {
  getName(): string {
    return 'Patch';
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
      minor: vi.minor,
      patch: vi.patch + 1,
      betaIndex: undefined
    }
  }
}
