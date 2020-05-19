import VersionProviderBase from './version-provider-base';
import { IszoleaVersionInfo } from '../version';

export default class CustomVersionProvider extends VersionProviderBase {
  getName(): string {
    return 'Custom';
  }
  
  isCustom(): boolean {
    return true;
  }

  getNewVersion(): IszoleaVersionInfo | undefined {
    return undefined;
  }

  protected getTargetVersion(): IszoleaVersionInfo | undefined {
    return undefined;
  }

  canGenerateNewVersion(): boolean {
    return true;
  }
}
