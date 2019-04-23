import React, { Component } from 'react';
import './App.css';
import Header from './Components/Header';
import PublishView from './Components/PublishView';
import SettingsView from './Components/SettingsView';
import UpdateView from './Components/UpdateView';
import { connect, MapStateToPropsParam } from 'react-redux';
import { loadSettings } from './actions';
import { AppState, UpdateStatus } from './reducers/types';

interface AppStateOld {
  baseSlnPath: string;
  nuGetApiKey: string;
  uiPackageJsonPath: string;
  npmAutoLogin: boolean;
  npmLogin: string;
  npmPassword: string;
  npmEmail: string;
}

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
    }
  }

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
