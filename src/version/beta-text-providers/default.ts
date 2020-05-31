import { BetaTextProvider } from '.';

export class DefaultBetaTextProvider implements BetaTextProvider {
  getText(): string | undefined {
    return '-beta';
  }
}
