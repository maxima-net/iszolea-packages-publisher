import { PACKAGE_VERSION_REGEX } from './version';

export default class NugetVersionConvertor {
  convertToAssemblyVersion(packageVersion: string): string | undefined {
    const pvMatch = PACKAGE_VERSION_REGEX.exec(packageVersion);

    if (!pvMatch) {
      return undefined;
    }

    return `${pvMatch[1]}.${pvMatch[2]}.${pvMatch[3]}${pvMatch[4] ? `.${pvMatch[4]}` : ''}`;
  }
}
