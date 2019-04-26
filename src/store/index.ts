import { createStore, applyMiddleware } from 'redux';
import rootReducer from '../reducers/index';
import { settingsCheckingMiddleware, selectProjectMiddleware } from '../middleware';
import { selectVersionProviderMiddleware } from '../middleware/selectVersionProviderMiddlevare';
import thunk from 'redux-thunk';

const store = createStore(
  rootReducer,
  applyMiddleware(
    thunk,
    settingsCheckingMiddleware, 
    selectProjectMiddleware as any, 
    selectVersionProviderMiddleware as any
  )
);
export default store;
