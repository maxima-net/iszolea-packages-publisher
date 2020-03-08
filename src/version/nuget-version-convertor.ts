import { PACKAGE_VERSION_REGEX } from './version';
import VersionConvertor from './version-converter';

export default class NugetVersionConvertor implements VersionConvertor {
  convertToAssemblyVersion(packageVersion: string): string | undefined {
    const pvMatch = PACKAGE_VERSION_REGEX.exec(packageVersion);

    if (!pvMatch) {
      return undefined;
    }

    return `${pvMatch[1]}.${pvMatch[2]}.${pvMatch[3]}${pvMatch[4] ? `.${pvMatch[4]}` : ''}`;
  }
}
