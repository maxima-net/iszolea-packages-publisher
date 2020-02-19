import React from 'react';
import './App.scss';
import SettingsView from './Containers/SettingsView';
import UpdateView from './Containers/UpdateView';
import PublishExecutingView from './Containers/PublishExecutingView';
import PublishSetupForm from './Containers/PublishSetupForm';
import InitializationView from './Containers/InitializationView';
import { Switch, Route } from 'react-router';
import routes from './routes';
import PublishedPackagesView from './Containers/PublishedPackagesView';

const App: React.FC = () => {
  return (
    <Switch>
      <Route exact path={routes.root}>
        <UpdateView />
      </Route>
      <Route path={routes.initialization}>
        <InitializationView />
      </Route>
      <Route path={routes.settings}>
        <SettingsView />
      </Route>
      <Route path={routes.publishSetup}>
        <PublishSetupForm />
      </Route>
      <Route path={routes.publishExecuting}>
        <PublishExecutingView />
      </Route>
      <Route path={routes.publishedPackages}>
        <PublishedPackagesView />
      </Route>
    </Switch>
  );
};

export default App;
