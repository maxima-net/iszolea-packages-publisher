import React from 'react';
import './UpdateView.css'
import { UpdateInfo } from 'electron-updater';

export enum UpdateStatus {
  Checking,
  UpdateIsNotAvailable,
  UpdateIsAvailable,
  UpdateIsDownloading,
  UpdateIsDownloaded,
  DeclinedByUser,
  Error
}

export interface UpdateViewProps {
  status: UpdateStatus;
  updateInfo: UpdateInfo | undefined;
  handleInstallNowClick: () => void;
  handleInstallLaterClick: () => void;
}

export default function UpdateView(props: UpdateViewProps) {
  const updateButtonsStyle = { display: props.status === UpdateStatus.UpdateIsDownloaded ? undefined : 'none' };
  const closeButtonsStyle = { display: props.status === UpdateStatus.Error ? undefined : 'none' };
  const { text, icon } = getStatusParameters(props.status, props.updateInfo);
  const showProgressBar = props.status === UpdateStatus.UpdateIsAvailable || props.status === UpdateStatus.UpdateIsDownloading;

  return (
    <div>
      <nav>
        <div className="nav-wrapper blue darken-1">
          <a href="#" tabIndex={-1} className="brand-logo center">Auto Update</a>
        </div>
      </nav>
      <div className="view-container view-container-update center">
        <div className="update-icon-container">
          <i className="update-icon material-icons blue-text darken-3-text">{icon}</i>
        </div>
        <div className="progress" style={{ display: showProgressBar ? undefined : 'none' }}>
          <div className="indeterminate"></div>
        </div>
        <p className="flow-text">{text}</p>
        <div className="button-container-update">
          <button
            style={updateButtonsStyle}
            className="waves-effect waves-light btn blue darken-1"
            onClick={props.handleInstallNowClick}>
            Install now
          </button>
          <button
            style={updateButtonsStyle}
            className="waves-effect waves-light btn blue lighten-2"
            onClick={props.handleInstallLaterClick}>
            Install later
          </button>
          <button
            style={closeButtonsStyle}
            className="waves-effect waves-light btn blue darken-1"
            onClick={props.handleInstallLaterClick}>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

function getStatusParameters(status: UpdateStatus, updateInfo: UpdateInfo | undefined): { text: string, icon: string } {
  const version = updateInfo ? updateInfo.version : 'Version is unknown';

  switch (status) {
    case UpdateStatus.Checking:
      return { text: 'Checking for updates', icon: 'cloud' };
    case UpdateStatus.UpdateIsNotAvailable:
      return { text: 'Updates are not available', icon: 'cloud_done' };
    case UpdateStatus.UpdateIsAvailable:
      return { text: `The newest version of the app is available (${version}). Downloading...`, icon: 'cloud_download' };
    case UpdateStatus.UpdateIsDownloading:
      return { text: `The newest version of the app is downloading (${version})`, icon: 'cloud_download' };
    case UpdateStatus.UpdateIsDownloaded:
      return { text: `The newest version of the app is downloaded`, icon: 'cloud_done' };
    case UpdateStatus.DeclinedByUser:
      return { text: 'The update is declined by user', icon: 'cloud_off' };
    case UpdateStatus.Error:
      return { text: 'There was an error during the update checking. See a log file for details', icon: 'error' };

    default:
      return { text: 'Update status is unknown', icon: 'error' };
  }
}
