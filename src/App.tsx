import React, { Component } from 'react';
import './App.css';
import Header from './Components/Header';
import PublishForm from './Components/PublishForm';
import Settings from './Components/Settings';
import ConfigHelper from './config-helper';

interface AppState {
  isInitializing: boolean;
  baseSlnFolder: string | undefined;
  displaySettings: boolean;
}

enum SettingsKeys {
  BaseSlnFolder = 'baseSlnFolder'
}

class App extends Component<{}, AppState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      isInitializing: true,
      baseSlnFolder: undefined,
      displaySettings: false,
    }
  }

  render() {
    const displaySettings = this.checkSettingsIsRequired(); 
    const content = displaySettings 
      ? (
          <Settings
            applySettings={this.applySettings} 
            baseSlnFolder={this.state.baseSlnFolder}
          />
        ) 
      : <PublishForm />;  

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

  componentDidMount(){
    const baseSlnFolder = ConfigHelper.Get<string>(SettingsKeys.BaseSlnFolder);

    this.setState({
      baseSlnFolder
    });
  }

  applySettings = (baseSlnFolder: string) => {
    ConfigHelper.Set(SettingsKeys.BaseSlnFolder, baseSlnFolder)

    this.setState({
      baseSlnFolder
    });
  } 

  displaySettings = (display: boolean) => {
    this.setState({
      displaySettings: display
    });
  }

  checkSettingsIsRequired() : boolean {
    return !this.state.baseSlnFolder || this.state.displaySettings;
  }
}

export default App;
