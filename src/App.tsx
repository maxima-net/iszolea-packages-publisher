import React, { Component } from 'react';
import './App.css';
import Header from './Components/Header';
import PublishView from './Components/PublishView';
import SettingsView from './Components/SettingsView';
import ConfigHelper from './utils/config-helper';
import SettingsHelper from './utils/settings-helper';
import UpdateView, { UpdateStatus } from './Components/UpdateView';
import { ipcRenderer } from 'electron';
import { SignalKeys } from './signal-keys';
import logger from 'electron-log';
import { UpdateInfo } from 'electron-updater';

interface AppState {
  isInitializing: boolean;
  baseSlnPath: string;
  uiPackageJsonPath: string;
  nuGetApiKey: string;
  displaySettings: boolean;
  checkingUpdateStatus: UpdateStatus;
  updateInfo: UpdateInfo | undefined;
}

enum SettingsKeys {
  BaseSlnPath = 'baseSlnPath',
  UiPackageJsonPath = 'uiPackageJsonPath',
  NuGetApiKey = 'nuGetApiKey'
}

class App extends Component<{}, AppState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      isInitializing: true,
      baseSlnPath: '',
      nuGetApiKey: '',
      uiPackageJsonPath: '',
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

    const displaySettings = this.checkSettingsIsRequired();
    const content = displaySettings
      ? (
        <SettingsView
          key={SettingsHelper.getSettingsHash(this.state.baseSlnPath, this.state.nuGetApiKey, this.state.uiPackageJsonPath)}
          handleApplySettings={this.handleApplySettings}
          error={this.getSettingsError()}
          handleCancelClick={() => this.displaySettings(false)}
          baseSlnPath={this.state.baseSlnPath}
          uiPackageJsonPath={this.state.uiPackageJsonPath}
          nuGetApiKey={this.state.nuGetApiKey}
        />
      )
      : (
        <PublishView
          baseSlnPath={this.state.baseSlnPath}
          uiPackageJsonPath={this.state.uiPackageJsonPath}
          nuGetApiKey={this.state.nuGetApiKey}
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
    const baseSlnPath = ConfigHelper.Get<string>(SettingsKeys.BaseSlnPath);
    const nuGetApiKey = ConfigHelper.Get<string>(SettingsKeys.NuGetApiKey);
    const uiPackageJsonPath = ConfigHelper.Get<string>(SettingsKeys.UiPackageJsonPath);

    this.setState({
      baseSlnPath,
      nuGetApiKey,
      uiPackageJsonPath
    });
  }

  handleApplySettings = (baseSlnPath: string, nuGetApiKey: string, uiPackageJsonPath: string) => {
    ConfigHelper.Set(SettingsKeys.BaseSlnPath, baseSlnPath);
    ConfigHelper.Set(SettingsKeys.NuGetApiKey, nuGetApiKey);
    ConfigHelper.Set(SettingsKeys.UiPackageJsonPath, uiPackageJsonPath);

    const displaySettings = !SettingsHelper.checkSettingsAreCorrect(baseSlnPath, nuGetApiKey, uiPackageJsonPath);

    this.setState({
      baseSlnPath,
      nuGetApiKey,
      uiPackageJsonPath,
      displaySettings
    });
  }

  displaySettings = (display: boolean) => {
    this.setState({
      displaySettings: display
    });
  }

  checkSettingsIsRequired(): boolean {
    return !SettingsHelper.checkSettingsAreCorrect(this.state.baseSlnPath, this.state.nuGetApiKey, this.state.uiPackageJsonPath) || this.state.displaySettings;
  }

  getSettingsError(): string | undefined {
    return !SettingsHelper.checkSettingsAreCorrect(this.state.baseSlnPath, this.state.nuGetApiKey, this.state.uiPackageJsonPath)
      ? 'Some required settings are not provided'
      : undefined;
  }

  handleInstallNowClick = () => {
    ipcRenderer.send('install-update');
  }

  handleInstallLaterClick = () => {
    this.setState({
      checkingUpdateStatus: UpdateStatus.DeclinedByUser
    })
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

export default App;
