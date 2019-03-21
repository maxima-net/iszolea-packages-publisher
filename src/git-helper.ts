import SimpleGit from 'simple-git/promise';

export default class GitHelper {
  static async isEverythingCommitted(path: string) : Promise<boolean> {
    const git = SimpleGit(path);
    const status = await git.status();
    return status.isClean();
  }
}
