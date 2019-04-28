import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { AppState } from './types';
import settingsReducer from './settings/reducer';
import layoutReducer from './layout/reducer';
import publishingReducer from './publishing/reducer';

const rootReducer = combineReducers<AppState>({
  settings: settingsReducer,
  layout: layoutReducer,
  publishing: publishingReducer
});

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, composeEnhancers(
  applyMiddleware(thunk)
));

export default store;
