import { UpdateStatus, Layout } from '../types';
import { Reducer } from 'redux';
import { LayoutAction } from './types';

const initialState: Layout = {
  displaySettingsView: false,
  updateStatus: UpdateStatus.Checking,
  updateInfo: undefined
}

const layoutReducer: Reducer<Layout, LayoutAction> = (state = initialState, action) => {
  if (action.type === 'SWITCH_SETTINGS_VIEW') {
    return {
      ...state,
      displaySettingsView: action.payload
    };
  }

  if (action.type === 'CHANGE_UPDATE_STATUS') {
    return {
      ...state,
      updateStatus: action.payload.updateStatus,
      updateInfo: action.payload.updateInfo
    };
  }

  return state;
}

export default layoutReducer;
