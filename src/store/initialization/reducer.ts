import { AnyAction, Initialization } from '../types';
import { Reducer } from 'redux';

const initialState: Initialization = {
  isInitialized: false,
  isNuGetCommandAvailable: undefined,
  isDotNetCommandAvailable: undefined,
  isNpmCommandAvailable: undefined
}

const InitializationReducer: Reducer<Initialization, AnyAction> = (state = initialState, action) => {
  if (action.type === 'UPDATE_INITIALIZATION_INFO') {
    return { ...action.payload };
  }

  return state;
}

export default InitializationReducer;
