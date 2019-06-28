import React, { PureComponent } from 'react';
import { MapStateToPropsParam, connect } from 'react-redux';
import { updatePublishingInfo, rejectPublishing } from '../store/publishing/actions';
import { PublishingInfo, AppState } from '../store/types';
import { PublishingGlobalStage, PublishingStageStatus } from '../store/publishing/types';
import CheckRow from '../Components/CheckRow';
import ProgressBar from '../Components/ProgressBar';
import ErrorRow from '../Components/ErrorRow';
import ViewContainer from '../Components/ViewContainer';
import ProjectInfo from '../packages/project-info';
import './PublishExecutingView.scss';

interface MappedProps {
  projectInfo: ProjectInfo[];
  packageVersion: string;
  publishingInfo: PublishingInfo
}

const mapStateToProps: MapStateToPropsParam<MappedProps, any, AppState> = (state) => {
  if (!state.publishing.selectedPackageSet) {
    throw new Error('selectedPackageSet is undefined');
  }

  if (!state.publishing.publishingInfo) {
    throw new Error('publishingInfo is not defined');
  }

  return {
    projectInfo: state.publishing.selectedPackageSet.projectsInfo,
    packageVersion: state.publishing.newVersion,
    publishingInfo: state.publishing.publishingInfo
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
    const packages = this.props.projectInfo.map((i) => i.name)
    const packagesList = packages.map(p => {
      return `${p}.${this.props.packageVersion}`
    }).join(', ');

    const { error, globalStage } = this.props.publishingInfo;
    const isExecuting = globalStage === PublishingGlobalStage.Publishing
      || globalStage === PublishingGlobalStage.Rejecting;

    const isRejectAllowed = globalStage === PublishingGlobalStage.Published;

    const stagesItems = Array.from(this.props.publishingInfo.stages)
      .map(([k, v]) => (
        <CheckRow
          key={k}
          isChecked={v.status === PublishingStageStatus.Finished}
          isBlinking={v.status === PublishingStageStatus.Executing}
          isInvalid={v.status === PublishingStageStatus.Failed}
          text={`${v.text}${v.status === PublishingStageStatus.Executing ? '...' : ''}`}
        />)
      );

    return (
      <ViewContainer title={this.getTitle()}>
        <h5>{packagesList}</h5>
        <ErrorRow text={error} isVisible={!!error} />
        <ProgressBar isVisible={isExecuting} />
        {stagesItems}
        <div className="row row-publishing-buttons" style={{ display: isExecuting ? 'none' : undefined }}>
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
      </ViewContainer>
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
