import fs from 'fs';
import path from 'path';

enum Constants {
  BaseSlnFileName = 'ISOZ.sln'
}

enum IsozNuGetPackages {
  IsozBusiness = 'ISOZ.Business',
  IsozClaims = 'ISOZ.Claims',
  IsozCore = 'ISOZ.Core',
  IsozMessaging = 'ISOZ.Messaging',
  IsozSyncServiceCommon = 'ISOZ.SyncServiceCommon'
}

class IszoleaPathHelper {
  static checkBaseSlnPath(slnPath: string): boolean {
    return fs.existsSync(path.join(slnPath, Constants.BaseSlnFileName));
  }

  static getIszoleaProjectNames(slnPath: string): string[] {
    const result: string[] = [];

    for (const enumItem in IsozNuGetPackages) {
      const packageName = IsozNuGetPackages[enumItem];
      const csProjPath = path.join(slnPath, packageName, `${packageName}.csproj`);

      if (fs.existsSync(csProjPath)) {
        result.push(packageName);
      }
    }

    return result;
  }

  static getLocalPackageVersion(slnPath: string, packageName: string) : string | undefined {
    const csProjPath = path.join(slnPath, packageName, `${packageName}.csproj`);
    const content = fs.readFileSync(csProjPath).toString();
    
    const regex = /<Version>(.*)<\/Version>/gm;
    const parseResult = regex.exec(content);

    if(parseResult) {
      return parseResult[1];
    }

    return undefined;
  }
}

export default IszoleaPathHelper;
