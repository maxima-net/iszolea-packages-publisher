import React from 'react';
import { switchSettingsView } from '../store/layout/actions';
import { MapStateToPropsParam, connect } from 'react-redux';
import { AppState, UpdateStatus } from '../store/types';

interface MappedProps {
  isSettingsActive: boolean;
  isSettingsSwitchHidden: boolean;
}

const mapStateToProps: MapStateToPropsParam<MappedProps, any, AppState> = (state) => {
  const isUpdating = state.layout.updateStatus !== UpdateStatus.DeclinedByUser
  && state.layout.updateStatus !== UpdateStatus.UpdateIsNotAvailable;

  return {
    isSettingsActive: state.layout.displaySettingsView,
    isSettingsSwitchHidden: !!state.publishing.publishingInfo || isUpdating 
  };
}

interface Dispatchers {
  switchSettingsView(value: boolean): void;
}

const dispatchers: Dispatchers = {
  switchSettingsView
} 

type HeaderProps = MappedProps & Dispatchers;

function Header(props: HeaderProps) {
  const settingsLinkClass = props.isSettingsActive ? 'active' : undefined;

  return (
    <nav>
      <div className="nav-wrapper blue darken-1">
        <a href="#" tabIndex={-1} className="brand-logo center">Iszolea Packages Publisher</a>
        <ul className="right">
          <li
            className={settingsLinkClass}>
            <a
              href="#"
              tabIndex={-1}
              title="Settings"
              hidden={props.isSettingsSwitchHidden}
              onClick={() => props.switchSettingsView(!props.isSettingsActive)}>
              <i className="material-icons">settings</i>
            </a>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default connect(mapStateToProps, dispatchers)(Header);
