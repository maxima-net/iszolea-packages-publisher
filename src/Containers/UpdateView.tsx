import React, { Component, PureComponent } from 'react';
import './UpdateView.scss'
import { UpdateInfo } from 'electron-updater';
import { MapStateToPropsParam, connect } from 'react-redux';
import { changeUpdateStatus } from '../store/layout/actions';
import { ipcRenderer } from 'electron';
import { SignalKeys } from '../signal-keys';
import logger from 'electron-log';
import { UpdateStatus, AppState } from '../store/types';

interface MappedProps {
  status: UpdateStatus;
  updateInfo: UpdateInfo | undefined;
}

const mapStateToProps: MapStateToPropsParam<MappedProps, any, AppState> = (state) => {
  return {
    status: state.layout.updateStatus,
    updateInfo: state.layout.updateInfo
  }
};

interface Dispatchers {
  changeUpdateStatus: (updateStatus: UpdateStatus) => void;
}

const dispatchers: Dispatchers = {
  changeUpdateStatus
}

type UpdateViewProps = MappedProps & Dispatchers;

class UpdateView extends PureComponent<UpdateViewProps> {
  constructor(props: Readonly<UpdateViewProps>) {
    super(props);
    this.checkForUpdates();
  }

  checkForUpdates() {
    ipcRenderer.on(SignalKeys.UpdateIsAvailable, (sender: any, updateInfo: UpdateInfo) => {
      logger.info('update-is-available', updateInfo);
      this.props.changeUpdateStatus(UpdateStatus.UpdateIsAvailable);
    });

    ipcRenderer.on(SignalKeys.UpdateIsDownloading, (...args: any[]) => {
      logger.info('update-is-downloading', args);
      this.props.changeUpdateStatus(UpdateStatus.UpdateIsDownloading);
    });

    ipcRenderer.on(SignalKeys.UpdateIsDownloaded, (sender: any, updateInfo: UpdateInfo) => {
      logger.info('update-is-downloaded', updateInfo);
      this.props.changeUpdateStatus(UpdateStatus.UpdateIsDownloaded);
    });

    ipcRenderer.on(SignalKeys.UpdateIsNotAvailable, (sender: any, updateInfo: UpdateInfo) => {
      logger.info('update-is-not-available', updateInfo);
      this.props.changeUpdateStatus(UpdateStatus.UpdateIsNotAvailable);
    });

    ipcRenderer.on(SignalKeys.UpdateError, (sender: any, error: Error) => {
      this.props.changeUpdateStatus(UpdateStatus.Error);
    });

    ipcRenderer.send('check-for-updates');
  }

  render() {
    const updateButtonsStyle = { display: this.props.status === UpdateStatus.UpdateIsDownloaded ? undefined : 'none' };
    const closeButtonsStyle = { display: this.props.status === UpdateStatus.Error ? undefined : 'none' };
    const { text, icon } = getStatusParameters(this.props.status, this.props.updateInfo);
    const showProgressBar = this.props.status === UpdateStatus.UpdateIsAvailable || this.props.status === UpdateStatus.UpdateIsDownloading;

    return (
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
            onClick={this.handleInstallNowClick}>
            Install now
            </button>
          <button
            style={updateButtonsStyle}
            className="waves-effect waves-light btn blue lighten-2"
            onClick={this.handleRefuseInstallationClick}>
            Install later
            </button>
          <button
            style={closeButtonsStyle}
            className="waves-effect waves-light btn blue darken-1"
            onClick={this.handleRefuseInstallationClick}>
            Continue
            </button>
        </div>
      </div>
    );
  }

  handleInstallNowClick = () => {
    ipcRenderer.send('install-update');
  }

  handleRefuseInstallationClick = () => {
    this.props.changeUpdateStatus(UpdateStatus.DeclinedByUser);
  }
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

export default connect(mapStateToProps, dispatchers)(UpdateView);
