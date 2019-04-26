import { AnyAction } from '../actions/types';
import { Store } from 'redux';
import { AppState } from '../reducers/types';
import { applyProject } from '../actions';
import { getCurrentVersion, getVersionProviders } from '.';

export const selectProjectMiddleware = (store: Store<AppState, AnyAction>) => {
  return function (next: (action: AnyAction) => void) {
    return function (action: AnyAction) {
      if (action.type === 'SELECT_PROJECT') {
        const state = store.getState();
        const packageSetId = action.payload;

        const projectSet = state.availablePackages.filter(p => p.id === packageSetId)[0];
        const current = getCurrentVersion(projectSet, state);
        const versionProviders = getVersionProviders(current).filter(p => p.canGenerateNewVersion());
        const defaultVersionProvider = versionProviders && versionProviders.length ? versionProviders[0] : undefined;
        const versionProviderName = defaultVersionProvider ? defaultVersionProvider.getName() : '';
        const newVersion = defaultVersionProvider ? defaultVersionProvider.getNewVersionString() || '' : '';
        const isCustomVersionSelection = defaultVersionProvider ? defaultVersionProvider.isCustom() : false;

        return store.dispatch(applyProject(packageSetId, newVersion, versionProviderName, isCustomVersionSelection, undefined));
      }
      return next(action);
    };
  };
}


