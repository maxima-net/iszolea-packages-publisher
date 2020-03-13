import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { rejectPublishing, publishPackage, pushWithTags, finishPublishing } from '../store/publishing/actions';
import { AppState, Publishing } from '../store/types';
import { PublishingGlobalStage, PublishingStageStatus, PublishingStage } from '../store/publishing/types';
import CheckRow from '../Components/CheckRow';
import ProgressBar from '../Components/ProgressBar';
import ErrorRow from '../Components/ErrorRow';
import ViewContainer from '../Components/ViewContainer';
import './PublishExecutingPage.scss';
import Button from '../Components/Button';
import ConfirmDialog from '../Components/ConfirmDialog';
import config from '../config.json';
import Header from '../Components/Header';

const PublishExecutingPage: React.FC = () => {
  const confirmRejectDialog = React.createRef<ConfirmDialog>();
  const dispatch = useDispatch();

  const publishing = useSelector<AppState, Publishing>((state) => state.publishing);

  const { newVersion, publishingInfo, selectedPackageSet } = publishing;
  const projectInfo = selectedPackageSet && selectedPackageSet.projectsInfo;

  if (!projectInfo || !publishingInfo) {
    return <h2>Publishing info is not available</h2>;
  }

  const packages = projectInfo.map((i) => i.name);
  const packagesList = packages.map((p) => {
    return `${p}.${newVersion}`;
  }).join(', ');

  const { error, globalStage, stages } = publishingInfo;
  const isExecuting = globalStage === PublishingGlobalStage.Publishing
    || globalStage === PublishingGlobalStage.Rejecting
    || globalStage === PublishingGlobalStage.Pushing;

  const stagesItems = Array.from(publishingInfo.stages)
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
  const isRetryButtonVisible = isFailed && !stages.has(PublishingStage.GitPush);

  const showConfirmRejectDialog = () => confirmRejectDialog.current && confirmRejectDialog.current.show();
  const handleCloseClick = () => dispatch(finishPublishing());
  const handleRetryClick = () => dispatch(publishPackage());
  const handleRejectClick = () => dispatch(rejectPublishing());
  const handlePushWithTagsClick = () => dispatch(pushWithTags());

  const getPublishingTitle = () => {
    const globalStage = publishingInfo && publishingInfo.globalStage;
    
    switch (globalStage) {
      case PublishingGlobalStage.Publishing:
        return 'Publishing...';
      case PublishingGlobalStage.Published:
        return 'Published';
      case PublishingGlobalStage.Rejecting:
        return 'Rejecting...';
      case PublishingGlobalStage.Rejected:
        return 'Rejected';
      case PublishingGlobalStage.Pushing:
        return 'Pushing...';
      case PublishingGlobalStage.Pushed:
        return 'Published and Pushed';

      default:
        return 'Publishing stage is unknown';
    }
  };

  return (
    <>
      <Header title={getPublishingTitle()} /> 
      <ViewContainer>
        <h5>{packagesList}</h5>
        <ErrorRow text={error} isVisible={isFailed} />
        <ProgressBar isVisible={isExecuting} />
        {stagesItems}
        <div className="row row-publishing-buttons" style={{ display: isExecuting ? 'none' : undefined }}>
          <Button text="Git: Push with tags" onClick={handlePushWithTagsClick} icon="publish" color="blue" isHidden={!isPublishedButNotPushed} />
          <Button text="Retry" onClick={handleRetryClick} icon="replay" color="blue" isHidden={!isRetryButtonVisible} />
          <Button text="Close" onClick={handleCloseClick} icon="done" color="blue" />
          <Button text="UnPublish..." onClick={showConfirmRejectDialog} icon="clear" color="red" isHidden={!isPublished} />
        </div>
      </ViewContainer>
      <ConfirmDialog
        ref={confirmRejectDialog}
        title="Confirm rejection"
        text={config.texts.confirmRejectionText}
        confirmButtonText="Reject"
        onConfirm={handleRejectClick}
        isModal={true}
      />
    </>
  );
};

export default PublishExecutingPage;
