import { ChangeUpdateStatusAction } from './types';
import { UpdateStatus, ThunkAction } from '../types';
import { UpdateInfo } from 'electron-updater';
import { replace } from 'connected-react-router';
import routes from '../../routes';
import { initializePublishing } from '../publishing/actions';

export const processUpdate = (updateStatus: UpdateStatus, updateInfo?: UpdateInfo): ThunkAction => {
  return (dispatch) => {
    dispatch(changeUpdateStatus(updateStatus, updateInfo));

    if(updateStatus === UpdateStatus.DeclinedByUser || updateStatus === UpdateStatus.UpdateIsNotAvailable) {
      dispatch(replace(routes.initialization));
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

    dispatch(replace(route));
    if (route === routes.publishSetup) {
      dispatch(initializePublishing());
    }
  };
};

export const togglePublishedPackagesView = (): ThunkAction => {
  return (dispatch, getState) => {
    const currentRoute = getState().router.location.pathname;
    const route = currentRoute !== routes.publishedPackages ? routes.publishedPackages : routes.publishSetup;
    dispatch(replace(route));
  };
};
