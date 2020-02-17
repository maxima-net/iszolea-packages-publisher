import React from 'react';
import './ErrorRow.scss';

export interface ErrorRowProps {
  text: string | JSX.Element | undefined;
  isVisible?: boolean;
}

const ErrorRow: React.FC<ErrorRowProps> = (props) => {
  return (
    <div className="row row-error" style={{ display: props.isVisible === false ? 'none' : undefined }}>
      <blockquote>
        {props.text}
      </blockquote>
    </div>
  );
};

export default ErrorRow;
