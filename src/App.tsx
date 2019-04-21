import React, { Component } from 'react';
import './App.css';
import Header from './Components/Header';
import PublishView from './Components/PublishView';
import SettingsView from './Components/SettingsView';
import UpdateView, { UpdateStatus } from './Components/UpdateView';
import { ipcRenderer } from 'electron';
import { SignalKeys } from './signal-keys';
import logger from 'electron-log';
import { UpdateInfo } from 'electron-updater';
import { connect, MapStateToPropsParam } from 'react-redux';
import { loadSettings } from './actions';
import { AppState } from './reducers/types';

interface AppStateOld {
  baseSlnPath: string;
  nuGetApiKey: string;
  uiPackageJsonPath: string;
  npmAutoLogin: boolean;
  npmLogin: string;
  npmPassword: string;
  npmEmail: string;
  displaySettings: boolean;
  checkingUpdateStatus: UpdateStatus;
  updateInfo: UpdateInfo | undefined;
}

interface MappedProps {
  isThereSettingsError: boolean;
  displaySettingsView: boolean;
  settingsHash: string;
}

const mapStateToProps: MapStateToPropsParam<MappedProps, any, AppState> = (state) => {
  return {
    isThereSettingsError: !!state.settings.mainError,
    displaySettingsView: state.displaySettingsView,
    settingsHash: state.settings.hash
  }
}

interface Dispatchers {
  loadSettings: () => void;
}

const dispatchers: Dispatchers = {
  loadSettings
} 

type AppProps = MappedProps & Dispatchers;

class App extends Component<AppProps, AppStateOld> {
  constructor(props: Readonly<AppProps>) {
    super(props);

    this.state = {
      baseSlnPath: '',
      nuGetApiKey: '',
      uiPackageJsonPath: '',
      npmAutoLogin: false,
      npmLogin: '',
      npmPassword: '',
      npmEmail: '',
      displaySettings: false,
      checkingUpdateStatus: UpdateStatus.Checking,
      updateInfo: undefined
    }

    this.checkForUpdates();
  }

  render() {
    const isDisplayUpdateViewRequired = this.state.checkingUpdateStatus === UpdateStatus.Checking
      || this.state.checkingUpdateStatus === UpdateStatus.UpdateIsAvailable
      || this.state.checkingUpdateStatus === UpdateStatus.UpdateIsDownloaded
      || this.state.checkingUpdateStatus === UpdateStatus.Error;

    if (isDisplayUpdateViewRequired) {
      return (<UpdateView
        status={this.state.checkingUpdateStatus}
        updateInfo={this.state.updateInfo}
        handleInstallNowClick={this.handleInstallNowClick}
        handleInstallLaterClick={this.handleInstallLaterClick}
      />)
    }

    const displaySettings = this.checkSettingsViewIsRequired();
    const content = displaySettings
      ? (
        <SettingsView key={this.props.settingsHash} />
      )
      : (
        <PublishView
          baseSlnPath={this.state.baseSlnPath}
          uiPackageJsonPath={this.state.uiPackageJsonPath}
          nuGetApiKey={this.state.nuGetApiKey}
          npmAutoLogin={this.state.npmAutoLogin}
          npmLogin={this.state.npmLogin}
          npmPassword={this.state.npmPassword}
          npmEmail={this.state.npmEmail}
        />
      );

    return (
      <div>
        <Header
          isSettingsActive={displaySettings}
          handleSettingsClick={this.displaySettings}
        />
        {content}
      </div>
    );
  }

  componentDidMount() {
    this.props.loadSettings();
  }

  displaySettings = (display: boolean) => {
    this.setState({ displaySettings: display });
  }

  checkSettingsViewIsRequired(): boolean {
    return this.props.isThereSettingsError || this.props.displaySettingsView;
  }

  handleInstallNowClick = () => {
    ipcRenderer.send('install-update');
  }

  handleInstallLaterClick = () => {
    this.setState({ checkingUpdateStatus: UpdateStatus.DeclinedByUser });
  }

  checkForUpdates() {
    ipcRenderer.on(SignalKeys.UpdateIsAvailable, (sender: any, updateInfo: UpdateInfo) => {
      logger.info('update-is-available', updateInfo);
      this.setState({
        checkingUpdateStatus: UpdateStatus.UpdateIsAvailable,
        updateInfo
      });
    });

    ipcRenderer.on(SignalKeys.UpdateIsDownloading, (...args: any[]) => {
      logger.info('update-is-downloading', args);
      this.setState({ checkingUpdateStatus: UpdateStatus.UpdateIsDownloading });
    });

    ipcRenderer.on(SignalKeys.UpdateIsDownloaded, (sender: any, updateInfo: UpdateInfo) => {
      logger.info('update-is-downloaded', updateInfo);
      this.setState({
        checkingUpdateStatus: UpdateStatus.UpdateIsDownloaded,
        updateInfo
      });
    });

    ipcRenderer.on(SignalKeys.UpdateIsNotAvailable, (sender: any, updateInfo: UpdateInfo) => {
      logger.info('update-is-not-available', updateInfo);
      this.setState({
        checkingUpdateStatus: UpdateStatus.UpdateIsNotAvailable,
        updateInfo
      });
    });

    ipcRenderer.on(SignalKeys.UpdateError, (sender: any, error: Error) => {
      this.setState({ checkingUpdateStatus: UpdateStatus.Error });
    });

    ipcRenderer.send('check-for-updates');
  }
}

export default connect(mapStateToProps, dispatchers)(App);
