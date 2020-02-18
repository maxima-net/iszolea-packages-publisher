import React from 'react';
import './Header.scss';
import { switchSettingsView, togglePublishedPackagesView } from '../store/layout/actions';
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
  const locationPath = useSelector<AppState, string>((state) => state.router.location.pathname);

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

  const dispatch = useDispatch();
 
  return (
    <div className="navbar-fixed">
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
                className={locationPath === routes.publishedPackages ? 'active' : undefined}>
                <a
                  href="#"
                  tabIndex={-1}
                  title="Published packages"
                  hidden={isSettingsSwitchHidden}
                  onClick={() => dispatch(togglePublishedPackagesView())}>
                  <i className="material-icons">storage</i>
                </a>
              </li>
              <li
                className={locationPath === routes.settings ? 'active' : undefined}>
                <a
                  href="#"
                  tabIndex={-1}
                  title="Settings"
                  hidden={isSettingsSwitchHidden}
                  onClick={() => dispatch(switchSettingsView(locationPath !== routes.settings))}>
                  <i className="material-icons">settings</i>
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
    </div>
  );
};

export default Header;
