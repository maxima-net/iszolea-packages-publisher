import React, { Component } from 'react';
import './PublishExecutingView.css';

export interface PublishingInfo {
  isEverythingCommitted?: boolean;
  isVersionApplied?: boolean;
  isBuildCompleted?: boolean;
  isPackagePublished?: boolean;
  isCommitMade?: boolean;
  isRejectAllowed?: boolean;
  isRejected?: boolean;
  error?: string
  isExecuting: boolean;
}

interface PublishExecutingViewProps extends PublishingInfo {
  packages: string[];
  packageVersion: string;
  handleCloseClick: () => void;
  handleRejectClick: () => void;
}

class PublishExecutingView extends Component<PublishExecutingViewProps> {
  render() {
    const packagesList = this.props.packages.map(p => {
      return `${p}.${this.props.packageVersion}`
    }).join(', ');
    const isOnePackage = this.props.packages.length === 1;

    return (
      <div className="view-container">
        <h4>Publishing</h4>
        <h5>{packagesList}</h5>
        <div className="row row-error" style={{ display: this.props.error ? undefined : 'none' }}>
          <blockquote>
            {this.props.error}
          </blockquote>
        </div>
        <div className="progress" style={{ display: this.props.isExecuting ? undefined : 'none' }}>
          <div className="indeterminate"></div>
        </div>
        {this.getInfoRow(this.props.isEverythingCommitted, 'The git repository is checked')}
        {this.getInfoRow(this.props.isVersionApplied, 'New version is applied')}
        {this.getInfoRow(this.props.isBuildCompleted, isOnePackage ? 'The project is built' : 'The projects are built')}
        {this.getInfoRow(this.props.isPackagePublished, isOnePackage ? 'The package is published' : 'The packages are published')}
        {this.getInfoRow(this.props.isCommitMade, `The changes are committed with versions tag${isOnePackage ? '' : 's'}`)}
        {this.getInfoRow(this.props.isRejected, 'The operation is rejected')}
        <div className="row row-buttons" style={{ display: this.props.isExecuting ? 'none' : undefined }}>
          <button
            className="waves-effect waves-light btn blue darken-1"
            onClick={this.props.handleCloseClick}>
            Publish another one
          </button>
          <button
            style={{ display: this.props.isRejectAllowed ? undefined : 'none' }}
            className="waves-effect waves-light btn red darken-1"
            onClick={this.props.handleRejectClick}>
            Reject publishing
          </button>
        </div>
      </div>
    )
  }

  getInfoRow(value: boolean | undefined, text: string) {
    return (
      <div
        style={{ display: value !== undefined ? undefined : 'none' }}
        className={`row ${value === false ? 'invalid' : ''}`}>
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
