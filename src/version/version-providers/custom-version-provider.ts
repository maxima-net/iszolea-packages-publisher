import { VersionProvider } from '.';
import VersionProviderBase from './version-provider-base';
import { IszoleaVersionInfo } from '../version';

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
