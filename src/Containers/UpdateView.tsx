import React, { PureComponent } from 'react';
import { UpdateInfo } from 'electron-updater';
import { MapStateToPropsParam, connect } from 'react-redux';
import { changeUpdateStatus } from '../store/layout/actions';
import { ipcRenderer } from 'electron';
import { SignalKeys } from '../signal-keys';
import logger from 'electron-log';
import { UpdateStatus, AppState } from '../store/types';
import ViewContainer from '../Components/ViewContainer';
import './UpdateView.scss';
import Button from '../Components/Button';

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
  changeUpdateStatus: (updateStatus: UpdateStatus, updateInfo?: UpdateInfo) => void;
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
      this.props.changeUpdateStatus(UpdateStatus.UpdateIsAvailable, updateInfo);
    });

    ipcRenderer.on(SignalKeys.UpdateIsDownloading, (...args: any[]) => {
      logger.info('update-is-downloading', args);
      this.props.changeUpdateStatus(UpdateStatus.UpdateIsDownloading);
    });

    ipcRenderer.on(SignalKeys.UpdateIsDownloaded, (sender: any, updateInfo: UpdateInfo) => {
      logger.info('update-is-downloaded', updateInfo);
      this.props.changeUpdateStatus(UpdateStatus.UpdateIsDownloaded, updateInfo);
    });

    ipcRenderer.on(SignalKeys.UpdateIsNotAvailable, (sender: any, updateInfo: UpdateInfo) => {
      logger.info('update-is-not-available', updateInfo);
      this.props.changeUpdateStatus(UpdateStatus.UpdateIsNotAvailable, updateInfo);
    });

    ipcRenderer.on(SignalKeys.UpdateError, (sender: any, error: Error) => {
      this.props.changeUpdateStatus(UpdateStatus.Error);
    });

    ipcRenderer.send('check-for-updates');
  }

  render() {
    const { text, icon } = getStatusParameters(this.props.status, this.props.updateInfo);
    const showProgressBar = this.props.status === UpdateStatus.UpdateIsAvailable || this.props.status === UpdateStatus.UpdateIsDownloading;
    const showReleaseNotes = this.props.status === UpdateStatus.UpdateIsDownloaded;
    const areInstallButtonsHidden = this.props.status !== UpdateStatus.UpdateIsDownloaded;

    return (
      <ViewContainer>
        <div className="content-wrapper center">
          <div className="update-icon-container">
            <i className="update-icon material-icons blue-text darken-3-text">{icon}</i>
          </div>

          <div className="progress" style={{ display: showProgressBar ? undefined : 'none' }}>
            <div className="indeterminate"></div>
          </div>

          <p className="flow-text">{text}</p>

          <div className={`input-field`} style={{ display: showReleaseNotes ? undefined : 'none' }} >
            <label className="active" htmlFor="release-notes">Release notes:</label>
            <textarea 
              id="release-notes"
              className="release-notes" 
              readOnly={true} 
              defaultValue={this.getReleaseNotesText()}
            />
          </div>

          <div className="button-container-update">
            <Button text="Install now" onClick={this.handleInstallNowClick} color="blue" isHidden={areInstallButtonsHidden} />
            <Button text="Install later" onClick={this.handleRefuseInstallationClick} color="deep-orange" isHidden={areInstallButtonsHidden} />
            <Button 
              text="Continue" 
              onClick={this.handleRefuseInstallationClick} 
              color="blue" 
              isHidden={this.props.status !== UpdateStatus.Error} 
              icon="warning" 
            />
          </div>
        </div>
      </ViewContainer>
    );
  }

  handleInstallNowClick = () => {
    ipcRenderer.send('install-update');
  }

  handleRefuseInstallationClick = () => {
    this.props.changeUpdateStatus(UpdateStatus.DeclinedByUser);
  }

  
  getReleaseNotesText() {
    const newLine = '\r\n';
    const tab = '\t';
    let result = '';

    if(this.props.updateInfo && Array.isArray(this.props.updateInfo.releaseNotes)) {
      const notes = this.props.updateInfo.releaseNotes;

      notes.forEach((n, i) => {
        if (i !== 0) {
          result += newLine;
        }

        result += `${n.version}${newLine}`;
        result += typeof n.note === 'string' ? `${tab}${n.note.replace('\n', newLine + tab)}${newLine}` : '';
      });
    }

    return result;
  }
}


function getStatusParameters(status: UpdateStatus, updateInfo: UpdateInfo | undefined): { text: string, icon: string } {
  const version = updateInfo ? updateInfo.version : 'version info is not available';

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
