import React from 'react';
import './App.scss';
import SettingsPage from './Pages/SettingsPage';
import UpdatePage from './Pages/UpdatePage';
import PublishExecutingPage from './Pages/PublishExecutingPage';
import PublishSetupPage from './Pages/PublishSetupPage';
import InitializationPage from './Pages/InitializationPage';
import { Switch, Route } from 'react-router';
import routes from './routes';
import PublishedPackagesPage from './Pages/PublishedPackagesPage';

const App: React.FC = () => {
  return (
    <Switch>
      <Route exact path={routes.root}>
        <UpdatePage />
      </Route>
      <Route path={routes.initialization}>
        <InitializationPage />
      </Route>
      <Route path={routes.settings}>
        <SettingsPage />
      </Route>
      <Route path={routes.publishSetup}>
        <PublishSetupPage />
      </Route>
      <Route path={routes.publishExecuting}>
        <PublishExecutingPage />
      </Route>
      <Route path={routes.publishedPackages}>
        <PublishedPackagesPage />
      </Route>
    </Switch>
  );
};

export default App;
