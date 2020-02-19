import React, {useEffect } from 'react';
import { UpdateInfo } from 'electron-updater';
import { useDispatch, useSelector } from 'react-redux';
import { processUpdate } from '../store/layout/actions';
import { ipcRenderer } from 'electron';
import { SignalKeys } from '../signal-keys';
import logger from 'electron-log';
import { UpdateStatus, AppState } from '../store/types';
import ViewContainer from '../Components/ViewContainer';
import './UpdateView.scss';
import Button from '../Components/Button';
import Header from '../Components/Header';

const UpdateView: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    ipcRenderer.on(SignalKeys.UpdateIsAvailable, (sender: any, updateInfo: UpdateInfo) => {
      logger.info('update-is-available', updateInfo);
      dispatch(processUpdate(UpdateStatus.UpdateIsAvailable, updateInfo));
    });

    ipcRenderer.on(SignalKeys.UpdateIsDownloading, (...args: any[]) => {
      logger.info('update-is-downloading', args);
      dispatch(processUpdate(UpdateStatus.UpdateIsDownloading));
    });

    ipcRenderer.on(SignalKeys.UpdateIsDownloaded, (sender: any, updateInfo: UpdateInfo) => {
      logger.info('update-is-downloaded', updateInfo);
      dispatch(processUpdate(UpdateStatus.UpdateIsDownloaded, updateInfo));
    });

    ipcRenderer.on(SignalKeys.UpdateIsNotAvailable, (sender: any, updateInfo: UpdateInfo) => {
      logger.info('update-is-not-available', updateInfo);
      dispatch(processUpdate(UpdateStatus.UpdateIsNotAvailable, updateInfo));
    });

    ipcRenderer.on(SignalKeys.UpdateError, () => {
      dispatch(processUpdate(UpdateStatus.Error));
    });

    ipcRenderer.send('check-for-updates');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    M.updateTextFields();
    M.AutoInit();
  });

  const status = useSelector<AppState, UpdateStatus>((state) => state.layout.updateStatus);
  const updateInfo = useSelector<AppState, UpdateInfo | undefined>((state) => state.layout.updateInfo);

  const getStatusParameters = (status: UpdateStatus, updateInfo: UpdateInfo | undefined): { text: string; icon: string } => {
    const version = updateInfo ? updateInfo.version : 'version info is not available';
  
    switch (status) {
      case UpdateStatus.Checking:
        return { text: 'Checking for updates...', icon: 'cloud' };
      case UpdateStatus.UpdateIsNotAvailable:
        return { text: 'Updates are not available', icon: 'cloud_done' };
      case UpdateStatus.UpdateIsAvailable:
        return { text: `The newest version of the app is available. Downloading v${version}...`, icon: 'cloud_download' };
      case UpdateStatus.UpdateIsDownloading:
        return { text: `The newest version of the app is being downloaded v${version}...`, icon: 'cloud_download' };
      case UpdateStatus.UpdateIsDownloaded:
        return { text: 'The newest version of the app has been downloaded', icon: 'cloud_done' };
      case UpdateStatus.DeclinedByUser:
        return { text: 'The update has been declined by user', icon: 'cloud_off' };
      case UpdateStatus.Error:
        return { text: 'There was an error during the update checking. See a log file for details', icon: 'error' };
  
      default:
        return { text: 'Update status is unknown', icon: 'error' };
    }
  };

  const { text, icon } = getStatusParameters(status, updateInfo);
  const showProgressBar = status === UpdateStatus.UpdateIsAvailable || status === UpdateStatus.UpdateIsDownloading;
  const showReleaseNotes = status === UpdateStatus.UpdateIsDownloaded;
  const areInstallButtonsHidden = status !== UpdateStatus.UpdateIsDownloaded;

  const handleInstallNowClick = () => {
    ipcRenderer.send('install-update');
  };

  const handleRefuseInstallationClick = () => {
    dispatch(processUpdate(UpdateStatus.DeclinedByUser));
  };
  
  const getReleaseNotesText = () => {
    const newLine = '\r\n';
    const listItemMarker = '- ';
    let result = '';

    if(updateInfo && Array.isArray(updateInfo.releaseNotes)) {
      const notes = updateInfo.releaseNotes;

      notes.forEach((n, i) => {
        if (i !== 0) {
          result += newLine;
        }

        result += `${n.version}${newLine}`;
        result += typeof n.note === 'string' 
          ? `${listItemMarker}${n.note.replace('\n', newLine + listItemMarker).replace(/(<([^>]+)>)/ig, '')}${newLine}` 
          : '';
      });
    }

    return result;
  };

  return (
    <>
      <Header title="Auto Update" isLogoCentered={true} />
      <ViewContainer>
        <div className="content-wrapper center">
          <div className="update-icon-container">
            <i className="update-icon material-icons blue-text darken-3-text">{icon}</i>
          </div>

          <div className="progress" style={{ display: showProgressBar ? undefined : 'none' }}>
            <div className="indeterminate"></div>
          </div>

          <p className="flow-text">{text}</p>

          <div className="input-field release-notes-container" style={{ display: showReleaseNotes ? undefined : 'none' }} >
            <label className="active" htmlFor="release-notes">Release notes:</label>
            <textarea 
              id="release-notes"
              className="release-notes" 
              readOnly={true} 
              value={getReleaseNotesText()}
            />
          </div>

          <div className="button-container-update">
            <Button text="Install now" onClick={handleInstallNowClick} color="blue" isHidden={areInstallButtonsHidden} />
            <Button text="Install later" onClick={handleRefuseInstallationClick} color="deep-orange" isHidden={areInstallButtonsHidden} />
            <Button 
              text="Continue" 
              onClick={handleRefuseInstallationClick} 
              color="blue" 
              isHidden={status !== UpdateStatus.Error} 
              icon="warning" 
            />
          </div>
        </div>
      </ViewContainer>
    </>
  );
};

export default UpdateView;
