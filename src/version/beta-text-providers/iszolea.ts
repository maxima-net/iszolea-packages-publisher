import { BetaTextProvider } from '.';


export class IszoleaBetaTextProvider implements BetaTextProvider {
  private static readonly PBI_SELECTOR_REGEX = /(pbi-\d+)/gmi;
  private static readonly SPRINT_SELECTOR_REGEX = /^(sprint)$/gmi;

  private readonly branchName: string | undefined;

  constructor(branchName: string | undefined) {
    this.branchName = branchName;
  }

  getText(): string | undefined {
    const pbiMatchResult = this.branchName && this.branchName.match(IszoleaBetaTextProvider.PBI_SELECTOR_REGEX);
    if (pbiMatchResult && pbiMatchResult.length >= 1) {
      return `-${pbiMatchResult[0].toLowerCase()}`;
    }

    const sprintMatchResult = this.branchName && this.branchName.match(IszoleaBetaTextProvider.SPRINT_SELECTOR_REGEX);
    if (sprintMatchResult && sprintMatchResult.length >= 1) {
      return '-sprint';
    }
    
    return undefined;
  }
}
