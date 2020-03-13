import { BaseAction, PublishedPackagesLoadStatus, PackageVersionCache } from '../types';
import { PackageVersionInfo } from '../../version/nuget-versions-parser';

export interface SetPublishedVersions extends BaseAction {
  type: 'SET_PUBLISHED_VERSIONS';
  payload: {
    status: PublishedPackagesLoadStatus;
    packageName: string;
    lastUpdated: Date;
    versions: PackageVersionInfo[];
  };
}

export interface SetPublishedVersionsCache extends BaseAction {
  type: 'SET_PUBLISHED_VERSIONS_CACHE';
  payload: Map<string, PackageVersionCache>;
}

export type PublishedPackagesAction = SetPublishedVersions | SetPublishedVersionsCache;
