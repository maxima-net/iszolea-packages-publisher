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
    throw new Error('Method not implemented.');
  }

  canGenerateNewVersion(): boolean {
    return true;
  }
}
