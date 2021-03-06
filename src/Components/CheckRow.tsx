import React from 'react';
import './CheckRow.scss';

export interface CheckBoxProps {
  text: string;
  isChecked?: boolean;
  isInvalid?: boolean;
  isBlinking?: boolean;
}

const CheckRow: React.FC<CheckBoxProps> = (props) => {
  const classNames = ['row', 'check-row'];
  if (props.isBlinking) {
    classNames.push('blinking');
  }
  if (props.isInvalid) {
    classNames.push('invalid');
  }

  return (
    <div
      className={`${classNames.join(' ')}`}>
      <label>
        <input
          readOnly
          tabIndex={-1}
          checked={!!props.isChecked}
          type="checkbox"
        />
        <span>{props.text}</span>
      </label>
    </div>
  );
};

export default CheckRow;
