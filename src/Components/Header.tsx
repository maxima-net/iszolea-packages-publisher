import React from 'react';
import { switchSettingsView } from '../store/layout/actions';
import { MapStateToPropsParam, connect } from 'react-redux';
import { AppState } from '../store/types';

interface MappedProps {
  isSettingsActive: boolean;
}

const mapStateToProps: MapStateToPropsParam<MappedProps, any, AppState> = (state) => {
  return {
    isSettingsActive: state.layout.displaySettingsView
  }
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
