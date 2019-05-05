import React from 'react';
import { PublishingStageStatus, PublishingStageInfo } from '../store/publishing/types';
import './CheckRow.scss';

export function CheckRow(props:PublishingStageInfo) {
  const isExecuting = props.status === PublishingStageStatus.Executing;
  const className = props.status === PublishingStageStatus.Executing 
    ? 'executing'
    : props.status === PublishingStageStatus.Failed 
      ? 'invalid' 
      : '';

  return (
    <div
      className={`row check-row ${className}`}>
      <label>
        <input
          readOnly
          tabIndex={-1}
          checked={props.status === PublishingStageStatus.Finished}
          type="checkbox"
        />
        <span>{`${props.text}${isExecuting ? '...' : ''}`}</span>
      </label>
    </div>
  )
}
