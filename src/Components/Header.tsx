import React from 'react';
import './Header.scss';
import { switchSettingsView } from '../store/layout/actions';
import Log from 'electron-log';
import { useDispatch, useSelector } from 'react-redux';
import { AppState, UpdateStatus } from '../store/types';
import { shell } from 'electron';
import routes from '../routes';
import { config } from '../config';

interface HeaderProps {
  title: string;
  isLogoCentered?: boolean;
}

const Header: React.FC<HeaderProps> = (props) => {
  const locationPath = useSelector<AppState, string>((state) => state.router.location.pathname);

  const isInitializing = useSelector<AppState, boolean>((state) => state.initialization.isInitialized !== true);
  const isUpdating = useSelector<AppState, boolean>((state) => {
    const { updateStatus } = state.layout;
    return updateStatus !== UpdateStatus.DeclinedByUser && updateStatus !== UpdateStatus.UpdateIsNotAvailable;
  });
  const isPublishing = useSelector<AppState, boolean>((state) => !!state.publishing.publishingInfo);
  const isServiceProcess = isUpdating || isInitializing || isPublishing;

  const settingsClass = `${locationPath === routes.settings ? 'active' : ''} ${isServiceProcess ? 'hidden' : ''}`;
  const helpClass = `${isServiceProcess ? 'hidden' : ''}`;

  const openLog = () => {
    const logFilePath = Log.transports.file.findLogPath();
    shell.openExternal(logFilePath);
  };

  const dispatch = useDispatch();

  return (
    <div className="navbar-fixed">
      <nav>
        <div className="nav-wrapper blue darken-1">
          <div className={`container ${props.isLogoCentered ? 'centered' : ''}`}>
            <a href="#" tabIndex={-1} className={`brand-logo ${props.isLogoCentered ? 'center' : ''}`}>{props.title}</a>
            <ul className="app-nav-list right">
              <li>
                <a
                  href="#"
                  tabIndex={-1}
                  title="Open Log"
                  onClick={openLog}>
                  <i className="material-icons">assignment</i>
                  <span>Logs</span>
                </a>
              </li>
              <li
                className={settingsClass}>
                <a
                  href="#"
                  tabIndex={-1}
                  title="Settings"
                  onClick={() => dispatch(switchSettingsView(locationPath !== routes.settings))}>
                  <i className="material-icons">settings</i>
                  <span>Settings</span>
                </a>
              </li>
              {/* <li>
                <a
                  href="#"
                  tabIndex={-1}
                  title="">
                  <i className="material-icons"></i>
                </a>
              </li> */}
              <li
                className={helpClass}>
                <a
                  href={config.links.help}
                  target="_blank"
                  rel="noopener noreferrer"
                  tabIndex={-1}
                  title="How to use"
                >
                  <i className="material-icons">help</i>
                  <span>Help</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;
