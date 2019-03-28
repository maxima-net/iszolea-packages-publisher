import React, { Component } from 'react';
import './PublishExecutingView.css';

export interface PublishingInfo {
  isEverythingCommitted?: boolean;
  isVersionApplied?: boolean;
  isBuildCompleted?: boolean;
  isPackagePublished?: boolean;
  isCommitMade?: boolean;
  error?: string
  isExecuting: boolean;
}

interface PublishExecutingViewProps extends PublishingInfo {
  packages: string[];
  packageVersion: string;
  handleCloseClick: () => void;
}

class PublishExecutingView extends Component<PublishExecutingViewProps> {
  render() {
    const packagesList = this.props.packages.map(p => {
      return `${p}.${this.props.packageVersion}`
    }).join(', ');
    return (
      <div className="view-container">
        <h4>Publishing</h4>
        <h5>{packagesList}</h5>
        <div className="row" style={{ display: this.props.error ? undefined : 'none' }}>
          <blockquote>
            {this.props.error}
          </blockquote>
        </div>
        <div className="progress" style={{ display: this.props.isExecuting ? undefined : 'none' }}>
          <div className="indeterminate"></div>
        </div>
        {this.getInfoRow(this.props.isEverythingCommitted, 'Check the git repository')}
        {this.getInfoRow(this.props.isVersionApplied, 'Apply new version')}
        {this.getInfoRow(this.props.isBuildCompleted, 'Build the project(s)')}
        {this.getInfoRow(this.props.isPackagePublished, 'Publish the package(s)')}
        {this.getInfoRow(this.props.isCommitMade, 'Commit the changes with versions tag(s)')}
        <div className="row" style={{ display: this.props.isExecuting ? 'none' : undefined }}>
          <button
            className="waves-effect waves-light btn blue darken-1"
            onClick={this.props.handleCloseClick}>
            Publish another one
          </button>
        </div>
      </div>
    )
  }

  getInfoRow(value: boolean | undefined, text: string) {
    return (
      <div className={`row ${value === false ? 'invalid' : ''}`}>
        <label>
          <input
            readOnly
            id={text}
            tabIndex={-1}
            checked={!!value}
            type="checkbox"
          />
          <span>{text}</span>
        </label>
      </div>
    )
  }
}

export default PublishExecutingView;
