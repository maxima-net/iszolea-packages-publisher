import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppState, Publishing } from '../store/types';
import './ProjectStatus.scss';
import { checkGitRepository } from '../store/publishing/actions';

const ProjectsStatus: React.FC = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const gitTimer = setInterval(() => dispatch(checkGitRepository()), 3000);

    return () => {
      clearInterval(gitTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const publishing = useSelector<AppState, Publishing>((state) => state.publishing);
  const { isEverythingCommitted, branchName } = publishing;
  const isEverythingCommittedInputText = isEverythingCommitted === undefined
    ? 'Checking git status...'
    : isEverythingCommitted
      ? 'The git repository is OK'
      : 'Commit or remove unsaved changes';

  return (
    <div className={`git-info ${isEverythingCommitted === false ? 'invalid' : ''}`}>
      <label className="status-container">
        <input
          id="isEverythingCommitted"
          readOnly
          tabIndex={-1}
          checked={!!isEverythingCommitted}
          type="checkbox"
        />
        <span className="status-container__status">{isEverythingCommittedInputText}</span>
      </label>
      <label className="branch-container" style={{ visibility: branchName ? undefined : 'hidden' }} title="Current branch name">
        <i className="material-icons git-info__icon">call_split</i>
        <span className="branch-container__branch">{branchName}</span>
      </label>
    </div>
  );
};

export default ProjectsStatus;
