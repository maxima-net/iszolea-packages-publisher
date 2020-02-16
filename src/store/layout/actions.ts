import { ChangeUpdateStatusAction } from './types';
import { UpdateStatus, ThunkAction } from '../types';
import { UpdateInfo } from 'electron-updater';
import { push } from 'connected-react-router';
import routes from '../../routes';

export const processUpdate = (updateStatus: UpdateStatus, updateInfo?: UpdateInfo): ThunkAction => {
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

export const switchSettingsView = (displaySettings: boolean): ThunkAction => {
  return (dispatch, getState) => {
    const state = getState();
    const hasSettingError = !!state.settings.mainError;

    const route = hasSettingError || displaySettings
      ? routes.settings 
      : routes.publishSetup;

    dispatch(push(route));
  };
};
