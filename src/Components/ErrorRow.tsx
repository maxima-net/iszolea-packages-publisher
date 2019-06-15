import React from 'react';
import './ErrorRow.scss';

export interface ErrorRowProps {
  text: string | JSX.Element | Array<string | JSX.Element> |undefined;
  isVisible?: boolean;
}

export default function ErrorRow(props: ErrorRowProps) {
  return (
    <div className="row row-error" style={{ display: props.isVisible === false ? 'none' : undefined }}>
      <blockquote>
        {props.text}
      </blockquote>
    </div>
  );
}
