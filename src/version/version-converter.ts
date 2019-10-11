export default interface VersionConvertor {
  convertToAssemblyVersion(packageVersion: string): string | undefined;
}
