import SimpleGit from 'simple-git/promise';
import logger from 'electron-log';

export async function isEverythingCommitted(path: string): Promise<boolean> {
  const git = SimpleGit(path);
  const status = await git.status();
  return status.isClean();
}

export async function stageFiles(path: string): Promise<void> {
  const git = SimpleGit(path);
  await git.add('*');
}

export async function createCommitWithTags(path: string, tags: string[]): Promise<boolean> {
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

export async function resetChanges(path: string): Promise<boolean> {
  try {
    const git = SimpleGit(path);
    await git.reset('hard');
    return true;
  } catch (e) {
    logger.error('rejectChanges: ', e);
    return false;
  }
}

export async function removeLastCommitAndTags(path: string, tags: string[]): Promise<boolean> {
  try {
    const git = SimpleGit(path);
    for (const tag of tags) {
      await git.raw(['tag', '-d', `${tag}`]);
    }
    await git.reset(['--hard', 'HEAD~']);
    return true;
  } catch (e) {
    logger.error('rejectChanges: ', e);
    return false;
  }
}