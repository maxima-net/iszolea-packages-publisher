import React from 'react';

export interface CheckBoxProps {
  isChecked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  text: string
}

const CheckBox = (props: CheckBoxProps) => {
  return (
    <label>
      <input
        type="checkbox"
        checked={props.isChecked}
        onChange={props.onChange}
      />
      <span>{props.text}</span>
    </label>
  )
}

export default CheckBox;
