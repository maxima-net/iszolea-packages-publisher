import { ChangeUpdateStatusAction } from './types';
import { UpdateStatus, AppState } from '../types';
import { UpdateInfo } from 'electron-updater';
import { ThunkAction } from 'redux-thunk';
import { push } from 'connected-react-router';
import routes from '../../routes';

export const processUpdate = (updateStatus: UpdateStatus, updateInfo?: UpdateInfo): ThunkAction<any, AppState, any, any> => {
  return (dispatch) => {
    dispatch(changeUpdateStatus(updateStatus, updateInfo));

    if(updateStatus === UpdateStatus.DeclinedByUser || updateStatus === UpdateStatus.UpdateIsNotAvailable) {
      dispatch(push(routes.initialization));
    }
  };
};

const changeUpdateStatus = (updateStatus: UpdateStatus, updateInfo?: UpdateInfo): ChangeUpdateStatusAction => {
  return { type: 'CHANGE_UPDATE_STATUS', payload: { updateStatus, updateInfo } };
};

export const switchSettingsView = (displaySettings: boolean): ThunkAction<any, AppState, any, any> => {
  return (dispatch, getState) => {
    const state = getState();
    const hasSettingError = !!state.settings.mainError;

    const route = hasSettingError || displaySettings
      ? routes.settings 
      : routes.publishSetup;

    dispatch(push(route));
  };
};
