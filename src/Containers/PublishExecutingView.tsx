import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updatePublishingInfo, rejectPublishing, publishPackage, pushWithTags } from '../store/publishing/actions';
import { AppState, Publishing } from '../store/types';
import { PublishingGlobalStage, PublishingStageStatus, PublishingStage } from '../store/publishing/types';
import CheckRow from '../Components/CheckRow';
import ProgressBar from '../Components/ProgressBar';
import ErrorRow from '../Components/ErrorRow';
import ViewContainer from '../Components/ViewContainer';
import './PublishExecutingView.scss';
import Button from '../Components/Button';
import ConfirmDialog from '../Components/ConfirmDialog';
import config from '../config.json';

const PublishExecutingView: React.FC = () => {
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

  const showConfirmRejectDialog = () => confirmRejectDialog.current && confirmRejectDialog.current.show();
  const handleCloseClick = () => dispatch(updatePublishingInfo(undefined));
  const handleRetryClick = () => dispatch(publishPackage());
  const handleRejectClick = () => dispatch(rejectPublishing());
  const handlePushWithTagsClick = () => dispatch(pushWithTags());

  return (
    <>
      <ViewContainer>
        <h5>{packagesList}</h5>
        <ErrorRow text={error} isVisible={isFailed} />
        <ProgressBar isVisible={isExecuting} />
        {stagesItems}
        <div className="row row-publishing-buttons" style={{ display: isExecuting ? 'none' : undefined }}>
          <Button text="Ok, thanks" onClick={handleCloseClick} icon="done" color="blue" />
          <Button text="Retry" onClick={handleRetryClick} icon="replay" color="blue" isHidden={!isFailed} />
          <Button text="Git: Push with tags" onClick={handlePushWithTagsClick} icon="publish" color="blue" isHidden={!isPublishedButNotPushed} />
          <Button text="UnPublish" onClick={showConfirmRejectDialog} icon="clear" color="red" isHidden={!isPublished} />
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

export default PublishExecutingView;
