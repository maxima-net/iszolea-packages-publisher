import { BaseAction, PublishedPackagesLoadStatus } from '../types';
import { PackageVersionInfo } from '../../version/nuget-versions-parser';

export interface SetPublishedVersions extends BaseAction {
  type: 'SET_PUBLISHED_VERSIONS';
  payload: {
    status: PublishedPackagesLoadStatus;
    packageName: string;
    versions: PackageVersionInfo[];
  };
}

export interface SetPublishedVersionsCache extends BaseAction {
  type: 'SET_PUBLISHED_VERSIONS_CACHE';
  payload: Map<string, PackageVersionInfo[]>;
}

export type PublishedPackagesAction = SetPublishedVersions | SetPublishedVersionsCache;
