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
import { Switch, Route } from 'react-router';
import routes from './routes';

interface MappedProps {
  isInitialized: boolean | undefined;
  isThereSettingsError: boolean;
  checkingUpdateStatus: UpdateStatus;
  publishingInfo: PublishingInfo | undefined;
}

const mapStateToProps: MapStateToPropsParam<MappedProps, any, AppState> = (state) => {
  return {
    isInitialized: state.initialization.isInitialized,
    isThereSettingsError: !!state.settings.mainError,
    checkingUpdateStatus: state.layout.updateStatus,
    publishingInfo: state.publishing.publishingInfo
  };
};

interface Dispatchers {
  initialize: () => void;
}

const dispatchers: Dispatchers = {
  initialize
};

type AppProps = MappedProps & Dispatchers;

class App extends PureComponent<AppProps> {
  render() {
    return (
      <div>
        <Switch>
          <Route exact path={routes.root}>
            <>
              <Header title="Auto Update" isLogoCentered={true} />
              <UpdateView />
            </>
          </Route>

          <Route path={routes.initialization}>
            <>
              <Header title="Initialization" />
              <InitializationView />
            </>
          </Route>

          <Route path={routes.settings}>
            <>
              <Header title="Settings" />
              <SettingsView />
            </>
          </Route>

          <Route path={routes.publishSetup}>
            <>
              <Header title="Set-Up Publishing" />
              <PublishSetupForm />
            </>
          </Route>

          <Route path={routes.publishExecuting}>
            <>
              <Header title={this.getPublishingTitle()} />
              <PublishExecutingView />
            </>
          </Route>
        </Switch>
      </div>
    );
  }

  private getPublishingTitle(): string {
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
      case PublishingGlobalStage.Pushing:
        return 'Pushing...';
      case PublishingGlobalStage.Pushed:
        return 'Published and Pushed';

      default:
        return 'Publishing stage is unknown';
    }
  }
}

export default connect(mapStateToProps, dispatchers)(App);
