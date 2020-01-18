import React, { PureComponent } from 'react';
import { MapStateToPropsParam, connect } from 'react-redux';
import { updatePublishingInfo, rejectPublishing, publishPackage, pushWithTags } from '../store/publishing/actions';
import { PublishingInfo, AppState } from '../store/types';
import { PublishingGlobalStage, PublishingStageStatus, PublishingStage } from '../store/publishing/types';
import CheckRow from '../Components/CheckRow';
import ProgressBar from '../Components/ProgressBar';
import ErrorRow from '../Components/ErrorRow';
import ViewContainer from '../Components/ViewContainer';
import ProjectInfo from '../packages/project-info';
import './PublishExecutingView.scss';
import Button from '../Components/Button';
import ConfirmDialog from '../Components/ConfirmDialog';
import config from '../config.json';

interface MappedProps {
  projectInfo: ProjectInfo[];
  packageVersion: string;
  publishingInfo: PublishingInfo;
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
  };
};

interface Dispatchers {
  updatePublishingInfo: (publishingInfo: PublishingInfo | undefined) => void;
  rejectPublishing: () => void;
  publishPackage: () => void;
  pushWithTags: () => void;
}

const dispatchers: Dispatchers = {
  updatePublishingInfo,
  rejectPublishing,
  publishPackage,
  pushWithTags
};

type PublishExecutingViewProps = MappedProps & Dispatchers;

class PublishExecutingView extends PureComponent<PublishExecutingViewProps> {
  confirmRejectDialog = React.createRef<ConfirmDialog>();

  render() {
    const packages = this.props.projectInfo.map((i) => i.name);
    const packagesList = packages.map((p) => {
      return `${p}.${this.props.packageVersion}`;
    }).join(', ');

    const { error, globalStage, stages } = this.props.publishingInfo;
    const isExecuting = globalStage === PublishingGlobalStage.Publishing
      || globalStage === PublishingGlobalStage.Rejecting
      || globalStage === PublishingGlobalStage.Pushing;


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

    const isPublished = globalStage === PublishingGlobalStage.Published;
    const isPublishedButNotPushed = globalStage === PublishingGlobalStage.Published && !stages.has(PublishingStage.GitPush);
    const isFailed = !!error;

    return (
      <>
        <ViewContainer>
          <h5>{packagesList}</h5>
          <ErrorRow text={error} isVisible={isFailed} />
          <ProgressBar isVisible={isExecuting} />
          {stagesItems}
          <div className="row row-publishing-buttons" style={{ display: isExecuting ? 'none' : undefined }}>
            <Button text="Ok, thanks" onClick={this.handleCloseClick} icon="done" color="blue" />
            <Button text="Retry" onClick={this.handleRetryClick} icon="replay" color="blue" isHidden={!isFailed} />
            <Button text="Git: Push with tags" onClick={this.pushWithTags} icon="publish" color="blue" isHidden={!isPublishedButNotPushed} />
            <Button text="Reject" onClick={this.showConfirmRejectDialog} icon="clear" color="red" isHidden={!isPublished} />
          </div>
        </ViewContainer>
        <ConfirmDialog
          ref={this.confirmRejectDialog}
          title="Confirm rejection" 
          text={config.texts.confirmRejectionText}
          confirmButtonText="Reject" 
          onConfirm={this.handleRejectClick}
          isModal={true}
        />
      </>
    );
  }

  private showConfirmRejectDialog = () => {
    this.confirmRejectDialog.current && this.confirmRejectDialog.current.show();
  };

  private handleCloseClick = () => {
    this.props.updatePublishingInfo(undefined);
  };

  private handleRetryClick = () => {
    this.props.publishPackage();
  };

  private handleRejectClick = () => {
    this.props.rejectPublishing();
  };

  private pushWithTags = () => {
    this.props.pushWithTags();
  };
}

export default connect(mapStateToProps, dispatchers)(PublishExecutingView);
