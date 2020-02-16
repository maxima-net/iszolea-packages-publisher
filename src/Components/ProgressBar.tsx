import React from 'react';
import './ProgressBar.scss';

export interface ProgressBarProps {
  isVisible?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = (props) => {
  return (
    <div className="progress" style={{ display: props.isVisible === false ? 'none' : undefined }}>
      <div className="indeterminate"></div>
    </div>
  );
};

export default ProgressBar;
