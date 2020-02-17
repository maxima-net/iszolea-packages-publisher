import { VersionProvider, IszoleaVersionInfo } from '.';
import VersionProviderBase from './version-provider-base';

export default class CustomVersionProvider extends VersionProviderBase implements VersionProvider {
  getName(): string {
    return 'Custom';
  }
  
  isCustom(): boolean {
    return true;
  }

  getNewVersion(): IszoleaVersionInfo | undefined {
    return undefined;
  }

  canGenerateNewVersion(): boolean {
    return true;
  }
}
