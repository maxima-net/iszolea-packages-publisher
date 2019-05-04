import React, { Component } from 'react';
import './PublishExecutingView.scss';
import { MapStateToPropsParam, connect } from 'react-redux';
import { updatePublishingInfo, rejectPublishing } from '../store/publishing/actions';
import { PublishingInfo, AppState } from '../store/types';
import { PublishingStage, PublishingStageInfo, PublishingStageStatus } from '../store/publishing/types';

interface MappedProps {
  packages: string[];
  packageVersion: string;
  publishingInfo: PublishingInfo
}

const mapStateToProps: MapStateToPropsParam<MappedProps, any, AppState> = (state) => {
  const publishing = state.publishing;
  const selectedPackageSet = publishing.availablePackages.filter(p => p.id === publishing.packageSetId)[0];
  const packages = selectedPackageSet.projectsInfo.map((i) => i.name);

  if (publishing.publishingInfo === undefined) {
    throw new Error('publishingInfo is not defined');
  }

  return {
    packages,
    packageVersion: publishing.newVersion,
    publishingInfo: publishing.publishingInfo
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

    const { isExecuting, error, isRejectAllowed } = this.props.publishingInfo;

    const stagesItems = Array.from(this.props.publishingInfo.stages)
      .map(([k, v]) => this.getCheckRow(k, v));

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
        <ul>{stagesItems}</ul>
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

  getCheckRow(key: PublishingStage, info: PublishingStageInfo) {
    return (
      <div
        className={`row row-check ${info.status === PublishingStageStatus.Failed ? 'invalid' : ''}`}>
        <label>
          <input
            readOnly
            id={key.toString()}
            tabIndex={-1}
            checked={info.status === PublishingStageStatus.Finished}
            type="checkbox"
          />
          <span>{info.text}</span>
        </label>
      </div>
    )
  }

  getTitle(): string {
    const { isExecuting, stages, isRejected } = this.props.publishingInfo;
    
    if (isRejected) {
      return 'Rejected';
    }
    
    const stagesKeys = Array.from(stages, ([k]) => k);
    const isPublished = stagesKeys.some((s) => s === PublishingStage.PublishPackage);

    if (isPublished) {
      if (isExecuting) {
        return 'Rejecting';
      }
      return 'Published';
    }

    return 'Publishing';
  }

  handleCloseClick = () => {
    this.props.updatePublishingInfo(undefined);
  }

  handleRejectClick = async () => {
    await this.props.rejectPublishing();
  }
}

export default connect(mapStateToProps, dispatchers)(PublishExecutingView);
