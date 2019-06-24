import PackageSet from '../../packages/package-set';

export default class VersionTagGenerator {
  getVersionTags(packageSet: PackageSet, newVersion: string): string[] {
    const packages = packageSet.projectsInfo.map((i) => i.name);
    return packages.map(p => {
      return this.getVersionTag(p, newVersion);
    });
  }

  protected getVersionTag(packageName: string, version: string): string {
    return `${packageName}.${version}`;
  }
}
