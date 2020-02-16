import React from 'react';
import './Header.scss';
import { switchSettingsView } from '../store/layout/actions';
import Log from 'electron-log';
import { MapStateToPropsParam, connect } from 'react-redux';
import { AppState, UpdateStatus } from '../store/types';
import { shell } from 'electron';
import config from '../config.json';
import routes from '../routes';

interface MappedProps {
  isSettingsActive: boolean;
  isSettingsSwitchHidden: boolean;
}

const mapStateToProps: MapStateToPropsParam<MappedProps, any, AppState> = (state) => {
  const isInitializing = state.initialization.isInitialized !== true;
  const isUpdating = state.layout.updateStatus !== UpdateStatus.DeclinedByUser
    && state.layout.updateStatus !== UpdateStatus.UpdateIsNotAvailable;
  const isPublishing = !!state.publishing.publishingInfo;

  return {
    isSettingsActive: state.router.location.pathname === routes.settings,
    isSettingsSwitchHidden: isUpdating || isInitializing || isPublishing
  };
};

interface Dispatchers {
  switchSettingsView(value: boolean): void;
}

const dispatchers: Dispatchers = {
  switchSettingsView
};

interface OwnProps {
  title: string;
  isLogoCentered: boolean;
}

type HeaderProps = MappedProps & Dispatchers & OwnProps;

const Header: React.FC<HeaderProps> = (props) => {
  const settingsLinkClass = props.isSettingsActive ? 'active' : undefined;

  return (
    <nav>
      <div className="nav-wrapper blue darken-1">
        <div className={`container ${props.isLogoCentered ? 'centered' : ''}`}>
          <a href="#" tabIndex={-1} className={`brand-logo ${props.isLogoCentered ? 'center' : ''}`}>{props.title}</a>
          <ul className="right">
            <li>
              <a
                href="#"
                tabIndex={-1}
                title="Open Log"
                onClick={openLog}>
                <i className="material-icons">assignment</i>
              </a>
            </li>
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
            {/* <li>
              <a
                href="#"
                tabIndex={-1}
                title="How to use"
                hidden={props.isSettingsSwitchHidden}
                onClick={() => props.switchSettingsView(!props.isSettingsActive)}>
                <i className="material-icons">brightness_4</i>
              </a>
            </li> */}
            <li>
              <a
                href={config.links.help}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={-1}
                title="How to use"
                hidden={props.isSettingsSwitchHidden}>
                <i className="material-icons">help</i>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

function openLog() {
  const logFilePath = Log.transports.file.findLogPath();
  shell.openExternal(logFilePath);
}

export default connect(mapStateToProps, dispatchers)(Header);
