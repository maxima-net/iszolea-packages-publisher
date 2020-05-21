import VersionProviderBase from './version-provider-base';
import { VersionInfo } from '../version';

export default class CustomVersionProvider extends VersionProviderBase {
  getName(): string {
    return 'Custom';
  }
  
  isCustom(): boolean {
    return true;
  }

  getNewVersion(): VersionInfo | undefined {
    return undefined;
  }

  protected getTargetVersion(): VersionInfo | undefined {
    return undefined;
  }

  canGenerateNewVersion(): boolean {
    return true;
  }
}
