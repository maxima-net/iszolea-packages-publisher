import React from 'react';

export interface TextBoxProps {
  id: string;
  type: 'text' | 'password';
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  labelText: string;
  isValid: boolean;
  helpText?: string;
}

const TextBox = (props: TextBoxProps) => {
  return (
    <div className={`input-field blue-text darken-1 ${props.isValid ? 'valid' : 'invalid'}`}>
      <input
        id={props.id}
        type={props.type}
        value={props.value}
        onChange={props.onChange}
      />
      <label className="active" htmlFor={props.id}>{props.labelText}</label>
      {props.helpText && (<span className="helper-text">{props.helpText}</span>)}
    </div>
  );
}

export default TextBox;
