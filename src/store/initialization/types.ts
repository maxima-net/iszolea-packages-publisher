import { BaseAction, Initialization } from '../types';

export interface UpdateInitializationInfo extends BaseAction {
  type: 'UPDATE_INITIALIZATION_INFO';
  payload: Initialization;
}

export interface SetInitialized extends BaseAction {
  type: 'SET_INITIALIZED';
  payload: boolean;
}

export type InitializationAction = UpdateInitializationInfo | SetInitialized;
