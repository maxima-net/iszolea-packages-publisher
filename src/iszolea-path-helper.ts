import fs from 'fs';
import path from 'path';

enum Constants {
  BaseSlnFileName = 'ISOZ.sln'
}

class IszoleaPathHelper {
  static checkBaseSlnPath(slnPath: string) : boolean {
    return fs.existsSync(path.join(slnPath, Constants.BaseSlnFileName));
  }
}

export default IszoleaPathHelper;
