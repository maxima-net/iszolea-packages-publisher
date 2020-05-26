import { IszoleaBetaTextProvider } from '../iszolea';

interface TestCase {
  branchName: string;
  expectedBetaText: string | undefined;
};

it('iszolea beta text provider returns pbi text', () => {
  const testCases: TestCase[] = [
    { branchName: '',                                                             expectedBetaText: undefined   },
    { branchName: 'asdfasdf',                                                     expectedBetaText: undefined   },
    { branchName: 'feature/PBI-3759_sync_so_report',                              expectedBetaText: '-pbi-3759' },
    { branchName: 'feature/pbi-19-bla_bla_bla',                                   expectedBetaText: '-pbi-19'   },
    { branchName: 'feature/PBI-5463-implement-ihostedservice-to-import-edi-file', expectedBetaText: '-pbi-5463' },
  ];

  testCases.forEach((t) => {
    const provider = new IszoleaBetaTextProvider(t.branchName);

    const text = provider.getText();
    expect(text).toEqual(t.expectedBetaText);
  });
});

it('iszolea beta text provider returns sprint text', () => {
  const testCases: TestCase[] = [
    { branchName: '',       expectedBetaText: undefined },
    { branchName: 'sprint', expectedBetaText: '-sprint' },
    { branchName: 'SPRINT', expectedBetaText: '-sprint' },
    { branchName: 'SPRinT', expectedBetaText: '-sprint' },
  ];

  testCases.forEach((t) => {
    const provider = new IszoleaBetaTextProvider(t.branchName);

    const text = provider.getText();
    expect(text).toEqual(t.expectedBetaText);
  });
});
