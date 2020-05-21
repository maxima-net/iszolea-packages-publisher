import VersionConvertor from './version-converter';
import { PACKAGE_VERSION_CUSTOM_BETA_REGEX } from './version';

export default class NugetVersionConvertor implements VersionConvertor {
  convertToAssemblyVersion(packageVersion: string): string | undefined {
    const pvMatch = PACKAGE_VERSION_CUSTOM_BETA_REGEX.exec(packageVersion);

    if (!pvMatch) {
      return undefined;
    }

    return `${pvMatch[1]}.${pvMatch[2]}.${pvMatch[3]}${pvMatch[5] ? `.${pvMatch[5]}` : ''}`;
  }
}
