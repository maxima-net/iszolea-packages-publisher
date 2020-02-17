import React from 'react';
import './Header.scss';
import { switchSettingsView } from '../store/layout/actions';
import Log from 'electron-log';
import { useDispatch, useSelector } from 'react-redux';
import { AppState, UpdateStatus } from '../store/types';
import { shell } from 'electron';
import config from '../config.json';
import routes from '../routes';

interface HeaderProps {
  title: string;
  isLogoCentered?: boolean;
}

const Header: React.FC<HeaderProps> = (props) => {
  const dispatch = useDispatch();
  const onSettingsClick = () => {
    dispatch(switchSettingsView(!isSettingsActive));
  };

  const locationPath = useSelector<AppState, string>((state) => state.router.location.pathname);
  const isSettingsActive = locationPath === routes.settings;
  const settingsLinkClass = isSettingsActive ? 'active' : undefined;

  const isInitializing = useSelector<AppState, boolean>((state) => state.initialization.isInitialized !== true);
  const isUpdating = useSelector<AppState, boolean>((state) => {
    const { updateStatus } = state.layout;
    return updateStatus !== UpdateStatus.DeclinedByUser && updateStatus !== UpdateStatus.UpdateIsNotAvailable;
  });
  const isPublishing = useSelector<AppState, boolean>((state) => !!state.publishing.publishingInfo);
  const isSettingsSwitchHidden = isUpdating || isInitializing || isPublishing;

  const openLog = () => {
    const logFilePath = Log.transports.file.findLogPath();
    shell.openExternal(logFilePath);
  };

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
                hidden={isSettingsSwitchHidden}
                onClick={onSettingsClick}>
                <i className="material-icons">settings</i>
              </a>
            </li>
            {/* <li>
              <a
                href="#"
                tabIndex={-1}
                title="Theme"
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
                hidden={isSettingsSwitchHidden}>
                <i className="material-icons">help</i>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
