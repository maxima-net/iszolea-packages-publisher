import VersionTagGenerator from './version-tag-generator';

export default class NpmVersionTagGenerator extends VersionTagGenerator {
  protected getVersionTag(packageName: string, version: string): string {
    return super.getVersionTag(packageName, version);
  }
}
