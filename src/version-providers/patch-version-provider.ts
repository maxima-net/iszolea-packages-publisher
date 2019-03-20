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

    let patch = vi.patch;

    if (!vi.suffix) {
      patch = vi.patch + 1;
    } else {
      const regex = /beta.(\d+)/;
      const match = vi.suffix.match(regex);

      if (!match || match.length < 2) {
        return undefined;
      }

      patch = vi.patch;
    }

    return {
      major: vi.major,
      minor: vi.minor,
      patch: patch,
      betaIndex: undefined
    }
  }
}
