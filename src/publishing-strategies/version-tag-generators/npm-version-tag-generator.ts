import VersionTagGenerator from './version-tag-generator';

export default class NpmVersionTagGenerator extends VersionTagGenerator {
  protected getVersionTag(_packageName: string, version: string): string {
    return version;
  }
}
