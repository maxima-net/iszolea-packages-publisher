import { PublishedPackages, BaseAction } from '../types';

export interface SetPublishedVersions extends BaseAction {
  type: 'SET_PUBLISHED_VERSIONS';
  payload: PublishedPackages;
}

export type PublishedPackagesAction = SetPublishedVersions;
