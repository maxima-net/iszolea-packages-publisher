import { TargetVersionInfo } from '../version-provider-base';

export interface TestCase {
  current: string;
  expectedTarget: TargetVersionInfo;
  expectedNew: string;
} 
