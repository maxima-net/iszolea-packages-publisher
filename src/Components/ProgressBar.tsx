import React from 'react';
import './ProgressBar.scss';

export interface ProgressBarProps {
  isVisible?: boolean;
}

export default function ProgressBar(props: ProgressBarProps) {
  return (
    <div className="progress" style={{ display: props.isVisible === false ? 'none' : undefined }}>
      <div className="indeterminate"></div>
    </div>
  );
}
