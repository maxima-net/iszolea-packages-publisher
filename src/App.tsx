import React, { Component } from 'react';
import './App.css';
import Header from './Components/Header';
import PublishView from './Components/PublishView';
import SettingsView from './Components/SettingsView';
import ConfigHelper from './utils/config-helper';
import IszoleaPathHelper from './utils/iszolea-path-helper';

interface AppState {
  isInitializing: boolean;
  baseSlnPath: string;
  displaySettings: boolean;
}

enum SettingsKeys {
  BaseSlnPath = 'baseSlnPath'
}

class App extends Component<{}, AppState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      isInitializing: true,
      baseSlnPath: '',
      displaySettings: false,
    }
  }

  render() {
    const displaySettings = this.checkSettingsIsRequired();
    const content = displaySettings
      ? (
        <SettingsView
          key={this.state.baseSlnPath}
          handleApplySettings={this.handleApplySettings}
          handleCancelClick={() => this.displaySettings(false)}
          baseSlnPath={this.state.baseSlnPath}
        />
      )
      : (
        <PublishView 
          baseSlnPath={this.state.baseSlnPath}
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

    this.setState({
      baseSlnPath
    });
  }

  handleApplySettings = (baseSlnPath: string) => {
    ConfigHelper.Set(SettingsKeys.BaseSlnPath, baseSlnPath)
    const displaySettings = !IszoleaPathHelper.checkBaseSlnPath(baseSlnPath)

    this.setState({
      baseSlnPath,
      displaySettings
    });
  }

  displaySettings = (display: boolean) => {
    this.setState({
      displaySettings: display
    });
  }

  checkSettingsIsRequired(): boolean {
    const isBaseSlnPathSet = IszoleaPathHelper.checkBaseSlnPath(this.state.baseSlnPath)
    return !isBaseSlnPathSet || this.state.displaySettings;
  }
}

export default App;
