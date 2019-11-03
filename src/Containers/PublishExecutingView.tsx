import React, { PureComponent } from 'react';
import { MapStateToPropsParam, connect } from 'react-redux';
import { updatePublishingInfo, rejectPublishing, pushWithTags } from '../store/publishing/actions';
import { PublishingInfo, AppState } from '../store/types';
import { PublishingGlobalStage, PublishingStageStatus } from '../store/publishing/types';
import CheckRow from '../Components/CheckRow';
import ProgressBar from '../Components/ProgressBar';
import ErrorRow from '../Components/ErrorRow';
import ViewContainer from '../Components/ViewContainer';
import ProjectInfo from '../packages/project-info';
import './PublishExecutingView.scss';
import Button from '../Components/Button';

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
  pushWithTags: () => void;
}

const dispatchers: Dispatchers = {
  updatePublishingInfo,
  rejectPublishing,
  pushWithTags
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

    const isRejectAllowed = globalStage === PublishingGlobalStage.Published;

    return (
      <ViewContainer>
        <h5>{packagesList}</h5>
        <ErrorRow text={error} isVisible={!!error} />
        <ProgressBar isVisible={isExecuting} />
        {stagesItems}
        <div className="row row-publishing-buttons" style={{ display: isExecuting ? 'none' : undefined }}>
          <Button text="Ok, thanks" onClick={this.handleCloseClick} icon="done" color="blue" />
          <Button text="Push with tags" onClick={this.pushWithTags} icon="publish" color="blue" isHidden={!isRejectAllowed} />
          <Button text="Reject" onClick={this.handleRejectClick} icon="clear" color="red" isHidden={!isRejectAllowed} />
        </div>
      </ViewContainer>
    )
  }

  handleCloseClick = () => {
    this.props.updatePublishingInfo(undefined);
  }

  handleRejectClick = () => {
    this.props.rejectPublishing();
  }

  pushWithTags = () => {
    this.props.pushWithTags();
  }
}

export default connect(mapStateToProps, dispatchers)(PublishExecutingView);
