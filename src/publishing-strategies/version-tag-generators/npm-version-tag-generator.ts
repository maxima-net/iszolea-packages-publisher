import VersionTagGenerator from './version-tag-generator';
import { Constants } from '../../utils/path';

export default class NpmVersionTagGenerator extends VersionTagGenerator {
  protected getVersionTag(packageName: string, version: string): string {
    if (packageName === Constants.IszoleaUIPackageName) {
      return version;
    }
    return super.getVersionTag(packageName, version);
  }
}
