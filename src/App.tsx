import React, { PureComponent } from 'react';
import './App.scss';
import Header from './Components/Header';
import SettingsView from './Containers/SettingsView';
import UpdateView from './Containers/UpdateView';
import { connect, MapStateToPropsParam } from 'react-redux';
import PublishExecutingView from './Containers/PublishExecutingView';
import PublishSetupForm from './Containers/PublishSetupForm';
import { initialize } from './store/initialization/actions';
import { UpdateStatus, PublishingInfo, AppState } from './store/types';
import InitializationView from './Containers/InitializationView';
import { PublishingGlobalStage } from './store/publishing/types';

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
  initialize: () => void;
}

const dispatchers: Dispatchers = {
  initialize
}

type AppProps = MappedProps & Dispatchers;

class App extends PureComponent<AppProps> {
  render() {
    const [view, title, isLogoCentered] = this.getCurrentView()

    return (
      <div>
        <Header title={title} isLogoCentered={isLogoCentered} />
        {view}
      </div>
    );
  }

  getCurrentView(): [any, string, boolean] {
    const isDisplayUpdateViewRequired = this.props.checkingUpdateStatus === UpdateStatus.Checking
      || this.props.checkingUpdateStatus === UpdateStatus.UpdateIsAvailable
      || this.props.checkingUpdateStatus === UpdateStatus.UpdateIsDownloaded
      || this.props.checkingUpdateStatus === UpdateStatus.Error;

    const displaySettings = this.props.isThereSettingsError || this.props.displaySettingsView;

    const result: [any, string, boolean] = isDisplayUpdateViewRequired
      ? [<UpdateView />, 'Auto Update', true]
      : !this.props.isInitialized
        ? [<InitializationView />, 'Initialization', false]
        : displaySettings
          ? [<SettingsView />, 'Settings', false]
          : this.props.publishingInfo
            ? [<PublishExecutingView />, this.getPublishingTitle(), false]
            : [<PublishSetupForm />, 'Set-Up Publishing', false];

      
    return result;
  }

  getPublishingTitle(): string {
    const globalStage = this.props.publishingInfo && this.props.publishingInfo.globalStage;
    
    switch (globalStage) {
      case PublishingGlobalStage.Publishing:
        return 'Publishing...';
      case PublishingGlobalStage.Published:
        return 'Published';
      case PublishingGlobalStage.Rejecting:
        return 'Rejecting...';
      case PublishingGlobalStage.Rejected:
        return 'Rejected';

      default:
        return 'Publishing stage is unknown'
    }
  }
}

export default connect(mapStateToProps, dispatchers)(App);
