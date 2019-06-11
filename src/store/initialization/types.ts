import { BaseAction, Initialization } from '../types';

export interface UpdateInitializationInfo extends BaseAction {
  type: 'UPDATE_INITIALIZATION_INFO';
  payload: Initialization;
}
