import { AnyAction } from '../actions/types';
import { Store } from 'redux';
import { AppState } from '../reducers/types';
import { applyVersionProvider } from '../actions';
import { getCurrentVersion, getVersionProviders } from '.';

export const selectVersionProviderMiddleware = (store: Store<AppState, AnyAction>) => {
  return function (next: (action: AnyAction) => void) {
    return function (action: AnyAction) {
      if (action.type === 'SELECT_VERSION_PROVIDER') {
        const state = store.getState();
        const versionProviderName = action.payload;

        const packageSet = state.availablePackages.filter(p => p.id === state.packageSetId)[0];
        const currentVersion = getCurrentVersion(packageSet, state);
        const provider = getVersionProviders(currentVersion).find((p) => p.getName() === versionProviderName);
        const newVersion = provider ? provider.getNewVersionString() || '' : '';
        const isCustomVersionSelection = provider ? provider.isCustom() : false;

        return store.dispatch(applyVersionProvider(versionProviderName, newVersion, isCustomVersionSelection));
      }
      return next(action);
    };
  };
}
