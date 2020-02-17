import React from 'react';

export interface CheckBoxProps {
  isChecked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  text: string;
}

const CheckBox: React.FC<CheckBoxProps> = (props) => {
  return (
    <p>
      <label>
        <input
          className="filled-in"
          type="checkbox"
          checked={props.isChecked}
          onChange={props.onChange}
        />
        <span>{props.text}</span>
      </label>
    </p>
  );
};

export default CheckBox;
