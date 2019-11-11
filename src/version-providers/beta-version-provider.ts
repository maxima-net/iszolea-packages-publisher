import { VersionProvider, IszoleaVersionInfo } from '.';
import VersionProviderBase from './version-provider-base';

export default class BetaVersionProvider extends VersionProviderBase implements VersionProvider {
  getName(): string {
    return 'Beta';
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
    let betaIndex = 1;

    if (!vi.suffix) {
      patch = vi.patch + 1;
    } else {
      const regex = /beta.(\d+)/;
      const match = vi.suffix.match(regex);

      if (!match || match.length < 2) {
        return undefined;
      }

      const index = +match[1];
      betaIndex = index + 1;
    }

    return {
      major: vi.major,
      minor: vi.minor,
      patch,
      betaIndex
    };
  }
}
