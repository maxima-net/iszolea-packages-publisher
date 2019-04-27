import React, { Component } from 'react';
import './App.css';
import Header from './Components/Header';
import SettingsView from './Components/SettingsView';
import UpdateView from './Components/UpdateView';
import { connect, MapStateToPropsParam } from 'react-redux';
import { loadSettings } from './actions';
import { AppState, UpdateStatus, PublishingInfo } from './reducers/types';
import PublishExecutingView from './Components/PublishExecutingView';
import PublishSetupForm from './Components/PublishSetupForm';

interface MappedProps {
  isThereSettingsError: boolean;
  displaySettingsView: boolean;
  settingsHash: string;
  checkingUpdateStatus: UpdateStatus;
  publishingInfo: PublishingInfo | undefined;
}

const mapStateToProps: MapStateToPropsParam<MappedProps, any, AppState> = (state) => {
  return {
    isThereSettingsError: !!state.settings.mainError,
    displaySettingsView: state.displaySettingsView,
    settingsHash: state.settings.hash,
    checkingUpdateStatus: state.updateStatus,
    publishingInfo: state.publishingInfo
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
  componentDidMount() {
    this.props.loadSettings();
  }

  render() {
    const isDisplayUpdateViewRequired = this.props.checkingUpdateStatus === UpdateStatus.Checking
      || this.props.checkingUpdateStatus === UpdateStatus.UpdateIsAvailable
      || this.props.checkingUpdateStatus === UpdateStatus.UpdateIsDownloaded
      || this.props.checkingUpdateStatus === UpdateStatus.Error;

    if (isDisplayUpdateViewRequired) {
      return <UpdateView />;
    }

    const displaySettings = this.props.isThereSettingsError || this.props.displaySettingsView;
    const content = displaySettings
      ? <SettingsView key={this.props.settingsHash} />
      : this.props.publishingInfo
        ? <PublishExecutingView />
        : <PublishSetupForm />;

    return (
      <div>
        <Header />
        {content}
      </div>
    );
  }
}

export default connect(mapStateToProps, dispatchers)(App);
