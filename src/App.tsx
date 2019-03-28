import React, { Component } from 'react';
import './App.css';
import Header from './Components/Header';
import PublishView from './Components/PublishView';
import SettingsView from './Components/SettingsView';
import ConfigHelper from './utils/config-helper';
import SettingsHelper from './utils/settings-helper';
import UpdateView from './Components/UpdateView';
import { ipcRenderer } from 'electron';
import { AppUpdater } from 'electron-updater';

interface AppState {
  isInitializing: boolean;
  baseSlnPath: string;
  nuGetApiKey: string;
  displaySettings: boolean;
  isUpdateAvailable: boolean;
}

enum SettingsKeys {
  BaseSlnPath = 'baseSlnPath',
  NuGetApiKey = 'nuGetApiKey'
}

class App extends Component<{}, AppState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      isInitializing: true,
      baseSlnPath: '',
      nuGetApiKey: '',
      displaySettings: false,
      isUpdateAvailable: true
    }
    
    ipcRenderer.on('update-is-available', (event: any, updater: AppUpdater) => {
      this.setState({
        isUpdateAvailable: true
      });
    });
  }

  render() {
    const displaySettings = this.checkSettingsIsRequired();
    
    if (this.state.isUpdateAvailable) {
      return <UpdateView
        onInstallNowClick={this.onInstallNowClick}
        onInstallLaterClick={this.onInstallLaterClick}
      />
    }

    const content = displaySettings
      ? (
        <SettingsView
          key={SettingsHelper.getSettingsHash(this.state.baseSlnPath, this.state.nuGetApiKey)}
          handleApplySettings={this.handleApplySettings}
          error={this.getSettingsError()}
          handleCancelClick={() => this.displaySettings(false)}
          baseSlnPath={this.state.baseSlnPath}
          nuGetApiKey={this.state.nuGetApiKey}
        />
      )
      : (
        <PublishView 
          baseSlnPath={this.state.baseSlnPath}
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

    this.setState({
      baseSlnPath,
      nuGetApiKey
    });
  }

  handleApplySettings = (baseSlnPath: string, nuGetApiKey: string) => {
    ConfigHelper.Set(SettingsKeys.BaseSlnPath, baseSlnPath);
    ConfigHelper.Set(SettingsKeys.NuGetApiKey, nuGetApiKey)
    const displaySettings = !SettingsHelper.checkSettingsAreCorrect(baseSlnPath, nuGetApiKey);

    this.setState({
      baseSlnPath,
      nuGetApiKey,
      displaySettings
    });
  }

  displaySettings = (display: boolean) => {
    this.setState({
      displaySettings: display
    });
  }

  checkSettingsIsRequired(): boolean {
    return !SettingsHelper.checkSettingsAreCorrect(this.state.baseSlnPath, this.state.nuGetApiKey) || this.state.displaySettings;
  }

  getSettingsError(): string | undefined {
    return !SettingsHelper.checkSettingsAreCorrect(this.state.baseSlnPath, this.state.nuGetApiKey)
      ? 'Some required settings are not provided'
      : undefined;
  }

  onInstallNowClick = () => {
    ipcRenderer.send('install-update');
  }

  onInstallLaterClick = () => {
    this.setState({
      isUpdateAvailable: false
    })
  }
}

export default App;
