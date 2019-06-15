import React, { PureComponent } from 'react';
import './PublishExecutingView.scss';
import { MapStateToPropsParam, connect } from 'react-redux';
import { updatePublishingInfo, rejectPublishing } from '../store/publishing/actions';
import { PublishingInfo, AppState } from '../store/types';
import { PublishingGlobalStage, PublishingStageStatus } from '../store/publishing/types';
import CheckRow from '../Components/CheckRow';

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

class PublishExecutingView extends PureComponent<PublishExecutingViewProps> {
  render() {
    const packagesList = this.props.packages.map(p => {
      return `${p}.${this.props.packageVersion}`
    }).join(', ');

    const { error, globalStage } = this.props.publishingInfo;
    const isExecuting = globalStage === PublishingGlobalStage.Publishing
      || globalStage === PublishingGlobalStage.Rejecting;

    const isRejectAllowed = globalStage === PublishingGlobalStage.Published;

    const stagesItems = Array.from(this.props.publishingInfo.stages)
      .map(([k, v]) => {
        return <CheckRow
          key={k}
          isChecked={v.status === PublishingStageStatus.Finished}
          isBlinking={v.status === PublishingStageStatus.Executing}
          isInvalid={v.status === PublishingStageStatus.Failed}
          text={`${v.text}${v.status === PublishingStageStatus.Executing ? '...' : ''}`}
        />
      });

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
        {stagesItems}
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

  getTitle(): string {
    switch (this.props.publishingInfo.globalStage) {
      case PublishingGlobalStage.Publishing:
        return 'Publishing';
      case PublishingGlobalStage.Published:
        return 'Published';
      case PublishingGlobalStage.Rejecting:
        return 'Rejecting';
      case PublishingGlobalStage.Rejected:
        return 'Rejected';
    }
  }

  handleCloseClick = () => {
    this.props.updatePublishingInfo(undefined);
  }

  handleRejectClick = async () => {
    await this.props.rejectPublishing();
  }
}

export default connect(mapStateToProps, dispatchers)(PublishExecutingView);
