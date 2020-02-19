import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { AppState } from './types';
import settingsReducer from './settings/reducer';
import layoutReducer from './layout/reducer';
import publishingReducer from './publishing/reducer';
import InitializationReducer from './initialization/reducer';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { createMemoryHistory } from 'history';
import publishedPackagesReducer from './published-packages/reducer';

const createRootReducer = (history: any) => combineReducers<AppState>({
  router: connectRouter(history),
  initialization: InitializationReducer,
  settings: settingsReducer,
  layout: layoutReducer,
  publishing: publishingReducer,
  publishedPackages: publishedPackagesReducer
});

export const history = createMemoryHistory();

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  createRootReducer(history),
  composeEnhancers(
    applyMiddleware(
      routerMiddleware(history),
      thunk
    )
  )
);

export default store;
