import React, { Component } from 'react';
import './App.css';
import Header from './Components/Header';
import PublishView from './Components/PublishView';
import SettingsView from './Components/SettingsView';
import UpdateView from './Components/UpdateView';
import { connect, MapStateToPropsParam } from 'react-redux';
import { loadSettings } from './actions';
import { AppState, UpdateStatus } from './reducers/types';

interface MappedProps {
  isThereSettingsError: boolean;
  displaySettingsView: boolean;
  settingsHash: string;
  checkingUpdateStatus: UpdateStatus;
}

const mapStateToProps: MapStateToPropsParam<MappedProps, any, AppState> = (state) => {
  return {
    isThereSettingsError: !!state.settings.mainError,
    displaySettingsView: state.displaySettingsView,
    settingsHash: state.settings.hash,
    checkingUpdateStatus: state.updateStatus
  }
}

interface Dispatchers {
  loadSettings: () => void;
}

const dispatchers: Dispatchers = {
  loadSettings
} 

type AppProps = MappedProps & Dispatchers;

class App extends Component<AppProps> {
  render() {
    const isDisplayUpdateViewRequired = this.props.checkingUpdateStatus === UpdateStatus.Checking
      || this.props.checkingUpdateStatus === UpdateStatus.UpdateIsAvailable
      || this.props.checkingUpdateStatus === UpdateStatus.UpdateIsDownloaded
      || this.props.checkingUpdateStatus === UpdateStatus.Error;

    if (isDisplayUpdateViewRequired) {
      return (<UpdateView />);
    }

    const displaySettings = this.props.isThereSettingsError || this.props.displaySettingsView;
    const content = displaySettings
      ? (
        <SettingsView key={this.props.settingsHash} />
      )
      : (
        <PublishView />
      );

    return (
      <div>
        <Header />
        {content}
      </div>
    );
  }

  componentDidMount() {
    this.props.loadSettings();
  }
}

export default connect(mapStateToProps, dispatchers)(App);
