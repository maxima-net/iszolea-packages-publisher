import { CommandResult, executeCommand } from './command-executor';

export const getPackageVersions = async (packageName: string): Promise<CommandResult> => {
  return await executeCommand({
    command: 'npm',
    args: ['view', packageName, 'versions'],
    printResponse: false
  });
};
