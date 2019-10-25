import { UpdateStatus, Layout } from '../types';
import { Reducer } from 'redux';
import { LayoutAction } from './types';

// const testUpdateInfo = {
//   files: [{
//     sha512: 'WR+bi2jiwK0/u83whFM/v/MO9kVRkJoYF+m5wNu99j1Szp1wBA4JX5dCpgbyCJhCJOhmB9+af+Tvmg/fATzVwA==',
//     size: 69968687,
//     url: 'iszolea-packages-publisher-setup-0.4.5.exe'
//   }],
//   path: 'iszolea-packages-publisher-setup-0.4.5.exe',
//   releaseDate: '2019-10-24T13:26:06.474Z',
//   releaseName: '0.4.5',
//   releaseNotes: [
//     {
//       note: 'Try to fix publishing (tags)',
//       version: '0.4.5'
//     },
//     {
//       note: 'Add help button\nImprove styles and typography',
//       version: '0.4.4'
//     },
//     {
//       note: 'Added the ISOZ.SMP.Common project',
//       version: '0.4.3'
//     }
//   ],
//   sha512:'WR+bi2jiwK0/u83whFM/v/MO9kVRkJoYF+m5wNu99j1Szp1wBA4JX5dCpgbyCJhCJOhmB9+af+Tvmg/fATzVwA==',
//   version: '0.4.5'
// }

const initialState: Layout = {
  displaySettingsView: false,
  updateStatus: UpdateStatus.Checking,
  updateInfo: undefined
}

const layoutReducer: Reducer<Layout, LayoutAction> = (state = initialState, action) => {
  if (action.type === 'SWITCH_SETTINGS_VIEW') {
    return {
      ...state,
      displaySettingsView: action.payload
    };
  }

  if (action.type === 'CHANGE_UPDATE_STATUS') {
    return {
      ...state,
      updateStatus: action.payload.updateStatus,
      updateInfo: action.payload.updateInfo
    };
  }

  return state;
}

export default layoutReducer;
