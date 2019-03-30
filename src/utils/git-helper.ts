import SimpleGit from 'simple-git/promise';
import logger from 'electron-log';

export default class GitHelper {
  static async isEverythingCommitted(path: string): Promise<boolean> {
    const git = SimpleGit(path);
    const status = await git.status();
    return status.isClean();
  }

  static async stageFiles(path: string): Promise<void> {
    const git = SimpleGit(path);
    await git.add('*');
  }

  static async createCommitWithTags(path: string, tags: string[]): Promise<boolean> {
    try {
      const git = SimpleGit(path);
      await git.commit('Update package version');
      for (const tag of tags) {
        await git.addTag(tag);
      }
      return true;
    } catch (e) {
      logger.error('createCommitWithTags: ', e);
      return false;
    }
  }

  static async rejectChanges(path: string): Promise<boolean> {
    try {
      const git = SimpleGit(path);
      await git.reset('hard');
      return true;
    } catch (e) {
      logger.error('rejectChanges: ', e);
      return false;
    }
  }
}
