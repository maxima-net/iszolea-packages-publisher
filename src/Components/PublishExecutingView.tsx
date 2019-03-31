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

    const { isEverythingCommitted, isVersionApplied, isBuildCompleted,
      isPackagePublished, isCommitMade, isRejected
    } = this.props;

    return (
      <div className="view-container">
        <h4>{this.getTitle()}</h4>
        <h5>{packagesList}</h5>
        <div className="row row-error" style={{ display: this.props.error ? undefined : 'none' }}>
          <blockquote>
            {this.props.error}
          </blockquote>
        </div>
        <div className="progress" style={{ visibility: this.props.isExecuting ? undefined : 'hidden' }}>
          <div className="indeterminate"></div>
        </div>
        {this.getCheckRow(isEverythingCommitted, `The git repository is${isEverythingCommitted ? '' : ' not'} checked`)}
        {this.getCheckRow(isVersionApplied, `New version is${isVersionApplied ? '' : ' not'} applied`)}
        {this.getCheckRow(isBuildCompleted, `The project ${isOnePackage ? 'is' : 'are'}${isBuildCompleted ? '' : ' not'} built`)}
        {this.getCheckRow(isPackagePublished, `The package ${isOnePackage ? 'is' : 'are'}${isPackagePublished ? '' : ' not'} published`)}
        {this.getCheckRow(isCommitMade, `The changes are${isCommitMade ? '' : ' not'} committed with versions tag${isOnePackage ? '' : 's'}`)}
        {this.getCheckRow(isRejected, `The operations are${isRejected ? '' : ' not'} rejected`)}
        <div className="row row-buttons" style={{ display: this.props.isExecuting ? 'none' : undefined }}>
          <button
            className="waves-effect waves-light btn blue darken-1"
            onClick={this.props.handleCloseClick}>
            <i className="material-icons left">done</i>
            Ok, thanks
          </button>
          <button
            style={{ display: this.props.isRejectAllowed ? undefined : 'none' }}
            className="waves-effect waves-light btn red darken-1"
            onClick={this.props.handleRejectClick}>
            <i className="material-icons left">clear</i>
            Reject publishing
          </button>
        </div>
      </div>
    )
  }

  getCheckRow(value: boolean | undefined, text: string) {
    return (
      <div
        style={{ display: value !== undefined ? undefined : 'none' }}
        className={`row row-check ${value === false ? 'invalid' : ''}`}>
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

  getTitle(): string {
    if (this.props.isRejected) {
      return 'Rejected';
    }

    const isPublished = this.props.isEverythingCommitted
      && this.props.isVersionApplied
      && this.props.isBuildCompleted
      && this.props.isPackagePublished
      && this.props.isCommitMade;

    if (isPublished) {
      if (this.props.isExecuting) {
        return 'Rejecting'
      }
      return 'Published'
    }

    return 'Publishing'
  }
}

export default PublishExecutingView;
