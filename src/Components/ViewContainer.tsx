import React, { FunctionComponent } from 'react';
import './ViewContainer.scss';

export interface ViewContainerProps {
  title?: string;
}

const ViewContainer: FunctionComponent<ViewContainerProps> = (props) => {
  return (
    <div className="container view-container">
      {props.title && <h4>{props.title}</h4>}
      {props.children}
    </div>
  );
};

export default ViewContainer;
