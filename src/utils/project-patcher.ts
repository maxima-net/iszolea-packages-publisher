import fs from 'fs';

import IszoleaPathHelper from './iszolea-path-helper';

export default class ProjectPatcher {
  static versionRegex = /(<Version>)(.*)(<\/Version>)/;
  static assemblyVersionRegex = /(<AssemblyVersion>)(.*)(<\/AssemblyVersion>)/;
  static fileVersionRegex = /(<FileVersion>)(.*)(<\/FileVersion>)/;

  static getLocalPackageVersion(slnPath: string, packageName: string) : string | undefined {
    const csProjPath = IszoleaPathHelper.getProjectFilePath(slnPath, packageName);
    const content = fs.readFileSync(csProjPath).toString();
    
    const parseResult = ProjectPatcher.versionRegex.exec(content);

    if(parseResult && parseResult.length >= 3) {
      return parseResult[2];
    }

    return undefined;
  }

  static getLocalAssemblyVersion(slnPath: string, packageName: string) : string | undefined {
    const csProjPath = IszoleaPathHelper.getProjectFilePath(slnPath, packageName);
    const content = fs.readFileSync(csProjPath).toString();
    
    const parseResult = ProjectPatcher.assemblyVersionRegex.exec(content);

    if(parseResult && parseResult.length >= 3) {
      return parseResult[2];
    }

    return undefined;
  }

  static applyNewVersion(version: string, assemblyAndFileVersion: string, slnPath: string, packageName: string): boolean {
    try {
      const csProjPath = IszoleaPathHelper.getProjectFilePath(slnPath, packageName);
      const content = fs.readFileSync(csProjPath).toString();
      const newContent = content
        .replace(ProjectPatcher.versionRegex, `$1${version}$3`)
        .replace(ProjectPatcher.assemblyVersionRegex, `$1${assemblyAndFileVersion}$3`)
        .replace(ProjectPatcher.fileVersionRegex, `$1${assemblyAndFileVersion}$3`);
      fs.writeFileSync(csProjPath, newContent);

      return true;
    }
    catch {
      return false;
    }
  }
}
