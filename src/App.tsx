import React, { Component } from 'react';
import './App.css';
import Header from './Components/Header';
import PublishForm from './Components/PublishForm';
import Settings from './Components/Settings';

interface AppState {
  baseSlnFolder: string | undefined;
  displaySettings: boolean;
}

class App extends Component<{}, AppState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      baseSlnFolder: undefined,
      displaySettings: false,
    }
  }
  render() {
    const displaySettings = this.checkSettingsIsRequired(); 
    const content = displaySettings ? <Settings /> : <PublishForm />;  

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

  displaySettings = (display: boolean) => {
    this.setState({
      displaySettings: display
    })
  }

  checkSettingsIsRequired() : boolean {
    return !this.state.baseSlnFolder || this.state.displaySettings;
  }
}

export default App;
