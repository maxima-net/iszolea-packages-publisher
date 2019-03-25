import SimpleGit from 'simple-git/promise';

export default class GitHelper {
  static async isEverythingCommitted(path: string): Promise<boolean> {
    const git = SimpleGit(path);
    const status = await git.status();
    return status.isClean();
  }

  static async createCommitWithTags(path: string, tags: string[]): Promise<boolean> {
    try {
      const git = SimpleGit(path);
      await git.add('*');
      await git.commit('Update package version');
      for (const tag of tags) {
        await git.addTag(tag);
      }
      return true;
    }
    catch (e) {
      console.log(e)
      return false;
    }
  }

  static async rejectChanges(path: string): Promise<boolean> {
    try {
      const git = SimpleGit(path);
      await git.reset('hard');
      return true;
    }
    catch (e) {
      console.log(e)
      return false;
    }
  }
}
