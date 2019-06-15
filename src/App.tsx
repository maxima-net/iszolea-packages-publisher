import React, { PureComponent } from 'react';
import './App.scss';
import Header from './Components/Header';
import SettingsView from './Containers/SettingsView';
import UpdateView from './Containers/UpdateView';
import { connect, MapStateToPropsParam } from 'react-redux';
import PublishExecutingView from './Containers/PublishExecutingView';
import PublishSetupForm from './Containers/PublishSetupForm';
import { loadSettings } from './store/settings/actions';
import { checkRequirements } from './store/initialization/actions';
import { UpdateStatus, PublishingInfo, AppState } from './store/types';
import InitializationView from './Containers/InitializationView';

interface MappedProps {
  isInitialized: boolean | undefined;
  isThereSettingsError: boolean;
  displaySettingsView: boolean;
  checkingUpdateStatus: UpdateStatus;
  publishingInfo: PublishingInfo | undefined;
}

const mapStateToProps: MapStateToPropsParam<MappedProps, any, AppState> = (state) => {
  return {
    isInitialized: state.initialization.isInitialized,
    isThereSettingsError: !!state.settings.mainError,
    displaySettingsView: state.layout.displaySettingsView,
    checkingUpdateStatus: state.layout.updateStatus,
    publishingInfo: state.publishing.publishingInfo
  }
}

interface Dispatchers {
  loadSettings: () => void;
  checkRequirements: () => void;
}

const dispatchers: Dispatchers = {
  loadSettings,
  checkRequirements
}

type AppProps = MappedProps & Dispatchers;

class App extends PureComponent<AppProps> {
  async componentDidMount() {
    await this.props.checkRequirements();

    if (this.props.isInitialized) {
      this.props.loadSettings();
    }
  }

  render() {
    return (
      <div>
        <Header />
        {this.getCurrentView()}
      </div>
    );
  }

  getCurrentView() {
    const isDisplayUpdateViewRequired = this.props.checkingUpdateStatus === UpdateStatus.Checking
      || this.props.checkingUpdateStatus === UpdateStatus.UpdateIsAvailable
      || this.props.checkingUpdateStatus === UpdateStatus.UpdateIsDownloaded
      || this.props.checkingUpdateStatus === UpdateStatus.Error;

    const displaySettings = this.props.isThereSettingsError || this.props.displaySettingsView;

    const result = !this.props.isInitialized
      ? <InitializationView />
      : isDisplayUpdateViewRequired
        ? <UpdateView />
        : displaySettings
          ? <SettingsView />
          : this.props.publishingInfo
            ? <PublishExecutingView />
            : <PublishSetupForm />;

    return result;
  }
}

export default connect(mapStateToProps, dispatchers)(App);
