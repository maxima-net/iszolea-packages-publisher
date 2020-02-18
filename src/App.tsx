import React from 'react';
import { useSelector } from 'react-redux';
import './App.scss';
import Header from './Components/Header';
import SettingsView from './Containers/SettingsView';
import UpdateView from './Containers/UpdateView';
import PublishExecutingView from './Containers/PublishExecutingView';
import PublishSetupForm from './Containers/PublishSetupForm';
import InitializationView from './Containers/InitializationView';
import { PublishingGlobalStage } from './store/publishing/types';
import { Switch, Route } from 'react-router';
import routes from './routes';
import { AppState, PublishingInfo } from './store/types';
import PublishedPackagesView from './Containers/PublishedPackagesView';

const App: React.FC = () => {
  const publishingInfo = useSelector<AppState, PublishingInfo | undefined>((state) => state.publishing.publishingInfo);

  const getPublishingTitle = () => {
    const globalStage = publishingInfo && publishingInfo.globalStage;
    
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
  };

  return (
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
          <Header title={getPublishingTitle()} />
          <PublishExecutingView />
        </>
      </Route>

      <Route path={routes.publishedPackages}>
        <PublishedPackagesView />
      </Route>
    </Switch>
  );
};

export default App;
