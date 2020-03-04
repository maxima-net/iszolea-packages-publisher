import { VersionProvider } from '.';
import VersionProviderBase from './version-provider-base';
import { IszoleaVersionInfo } from '../version/version';

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
      patch,
      betaIndex: undefined
    };
  }
}
