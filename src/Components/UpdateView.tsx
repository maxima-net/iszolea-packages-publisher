import React from 'react';
import './UpdateView.css'

export interface UpdateViewProps {
  onInstallNowClick: () => void;
  onInstallLaterClick: () => void;
}

export default function UpdateView(props: UpdateViewProps) {
  return (
    <div>
      <nav>
        <div className="nav-wrapper blue darken-1">
          <a href="#" tabIndex={-1} className="brand-logo center">Update is available</a>
        </div>
      </nav>
      <div className="view-container view-container-update center">
        <h5>The newest version of the app is available</h5>
        <div className="update-icon-container">
          <i className="update-icon material-icons blue-text darken-3-text">cloud_download</i>
        </div>
        <div className="button-container-update">
          <button
            className="waves-effect waves-light btn blue darken-1">
            onClick={props.onInstallNowClick}
            Install now
          </button>
          <button
            className="waves-effect waves-light btn blue lighten-2">
            onClick={props.onInstallLaterClick}
            Install later
          </button>
        </div>
      </div>
    </div>
  );
}
