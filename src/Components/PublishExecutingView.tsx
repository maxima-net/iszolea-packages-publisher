import React, { Component } from 'react';
import './PublishExecutingView.css';
import { PublishingInfo, AppState } from '../reducers/types';
import { MapStateToPropsParam, connect } from 'react-redux';
import { rejectPublishing, updatePublishingInfo } from '../actions';

interface MappedProps {
  packages: string[];
  packageVersion: string;
  publishingInfo: PublishingInfo
}

const mapStateToProps: MapStateToPropsParam<MappedProps, any, AppState> = (state) => {
  const selectedPackageSet = state.availablePackages.filter(p => p.id === state.packageSetId)[0];
  const packages = selectedPackageSet.projectsInfo.map((i) => i.name);

  if (state.publishingInfo === undefined) {
    throw new Error('publishingInfo is not defined');
  }

  return {
    packages,
    packageVersion: state.newVersion,
    publishingInfo: state.publishingInfo
  }
}

interface Dispatchers {
  updatePublishingInfo: (publishingInfo: PublishingInfo | undefined) => void;
  rejectPublishing: () => void;
}

const dispatchers: Dispatchers = {
  updatePublishingInfo,
  rejectPublishing
}

type PublishExecutingViewProps = MappedProps & Dispatchers;

class PublishExecutingView extends Component<PublishExecutingViewProps> {
  render() {
    const packagesList = this.props.packages.map(p => {
      return `${p}.${this.props.packageVersion}`
    }).join(', ');
    const isOnePackage = this.props.packages.length === 1;

    const { isEverythingCommitted, isVersionApplied, isBuildCompleted,
      isPackagePublished, isCommitMade, isRejected, isExecuting, error,
      isRejectAllowed
    } = this.props.publishingInfo;

    return (
      <div className="view-container">
        <h4>{this.getTitle()}</h4>
        <h5>{packagesList}</h5>
        <div className="row row-error" style={{ display: error ? undefined : 'none' }}>
          <blockquote>
            {error}
          </blockquote>
        </div>
        <div className="progress" style={{ display: isExecuting ? undefined : 'none' }}>
          <div className="indeterminate"></div>
        </div>
        {this.getCheckRow(isEverythingCommitted, `The git repository is${isEverythingCommitted ? '' : ' not'} checked`)}
        {this.getCheckRow(isVersionApplied, `The new version is${isVersionApplied ? '' : ' not'} applied`)}
        {this.getCheckRow(isBuildCompleted, `The project${isOnePackage ? ' is' : 's are'}${isBuildCompleted ? '' : ' not'} built`)}
        {this.getCheckRow(isPackagePublished, `The package${isOnePackage ? ' is' : 's are'}${isPackagePublished ? '' : ' not'} published`)}
        {this.getCheckRow(isCommitMade, `The changes are${isCommitMade ? '' : ' not'} committed with version tag${isOnePackage ? '' : 's'}`)}
        {this.getCheckRow(isRejected, `The operations are${isRejected ? '' : ' not'} rejected`)}
        <div className="row row-buttons" style={{ display: isExecuting ? 'none' : undefined }}>
          <button
            className="waves-effect waves-light btn blue darken-1"
            onClick={this.handleCloseClick}>
            <i className="material-icons left">done</i>
            Ok, thanks
          </button>
          <button
            style={{ display: isRejectAllowed ? undefined : 'none' }}
            className="waves-effect waves-light btn red darken-1"
            onClick={this.handleRejectClick}>
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
    const { isEverythingCommitted, isVersionApplied, isBuildCompleted,
      isPackagePublished, isCommitMade, isRejected, isExecuting
    } = this.props.publishingInfo;

    if (isRejected) {
      return 'Rejected';
    }

    const isPublished = isEverythingCommitted
      && isVersionApplied
      && isBuildCompleted
      && isPackagePublished
      && isCommitMade;

    if (isPublished) {
      if (isExecuting) {
        return 'Rejecting'
      }
      return 'Published'
    }

    return 'Publishing'
  }

  handleCloseClick = () => {
    this.props.updatePublishingInfo(undefined);
  }

  handleRejectClick = async () => {
    await this.props.rejectPublishing();
  }
}

export default connect(mapStateToProps, dispatchers)(PublishExecutingView);
