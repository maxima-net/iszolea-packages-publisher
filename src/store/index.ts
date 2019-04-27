import { createStore, applyMiddleware } from 'redux';
import rootReducer from '../reducers/index';
import { selectVersionProviderMiddleware } from '../middleware/selectVersionProviderMiddlevare';
import thunk from 'redux-thunk';

const store = createStore(
  rootReducer,
  applyMiddleware(
    thunk,
    selectVersionProviderMiddleware as any
  )
);
export default store;
