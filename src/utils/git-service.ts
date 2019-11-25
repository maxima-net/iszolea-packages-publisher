import SimpleGit from 'simple-git/promise';
import logger from 'electron-log';

export class GitService {
  private readonly gitHelper: SimpleGit.SimpleGit;

  constructor(repoPath: string) {
    this.gitHelper = SimpleGit(repoPath);
  }

  async getCurrentBranchName(): Promise<string> {
    const branchInfo = await this.gitHelper.branch([]);
    
    return branchInfo.current;
  };
  
  async isEverythingCommitted(): Promise<boolean> {
    const status = await this.gitHelper.status();
    return status.isClean();
  }
  
  async stageFiles(): Promise<void> {
    await this.gitHelper.add('*');
  }

  async createCommitWithTags(tags: string[]): Promise<boolean> {
    try {
      const commitMessage = 'Update package version';
      logger.log(`commit with message: '${commitMessage}'`);
      await this.gitHelper.commit(commitMessage);
      
      for (const tag of tags) {
        logger.log(`add tag: '${tag}'`);
        // eslint-disable-next-line no-await-in-loop
        await this.gitHelper.addTag(tag);
      }
      
      return true;
    } catch (e) {
      logger.error('createCommitWithTags: ', e);
      return false;
    }
  }

  async pushWithTags(tags: string[]): Promise<boolean> {
    try {
      await this.push();
  
      for (const tag of tags) {
        // eslint-disable-next-line no-await-in-loop
        await this.pushTag(tag);
      }
  
      return true;
    } catch (e) {
      logger.error('pushWithTags: ', e);
      return false;
    }
  };

  async resetChanges(): Promise<boolean> {
    try {
      await this.gitHelper.reset('hard');
      return true;
    } catch (e) {
      logger.error('rejectChanges: ', e);
      return false;
    }
  }

  async removeLastCommitAndTags(tags: string[]): Promise<boolean> {
    try {
      for (const tag of tags) {
        // eslint-disable-next-line no-await-in-loop
        await this.gitHelper.raw(['tag', '-d', `${tag}`]);
      }
      await this.gitHelper.reset(['--hard', 'HEAD~']);
      return true;
    } catch (e) {
      logger.error('rejectChanges: ', e);
      return false;
    }
  }

  private async pushTag(tagName: string): Promise<void> {
    logger.log(`push tag ${tagName}`);
    await this.gitHelper.raw(['push', 'origin', tagName]);
  };

  private async push() {
    const branchName = this.getCurrentBranchName();
    logger.log(`current brach: ${branchName}`);
    const remoteBranches = (await this.gitHelper.branch({ '--remotes': null })).branches;
    logger.log(`remote branches: ${remoteBranches}`)

    const remoteBranchName = `origin/${branchName}`;
    let pushOptions;
    if(!remoteBranches[remoteBranchName]) {
      pushOptions = ['--set-upstream', 'origin', branchName];
    }
  
    logger.log(`push commit ${pushOptions ? 'with setting upstream' : ''}`);
    await this.gitHelper.push(pushOptions as any);
  };
}
