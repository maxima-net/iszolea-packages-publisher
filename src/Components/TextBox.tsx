import React from 'react';

export interface TextBoxProps {
  id?: string;
  name?: string;
  type: 'text' | 'password';
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  labelText: string;
  isValid?: boolean;
  placeholder?: string;
  helpText?: string;
  inputRef?: React.RefObject<HTMLInputElement>;
}

const TextBox: React.FC<TextBoxProps> = (props) => {
  const validationClass = props.isValid !== undefined 
    ? props.isValid ? 'valid' : 'invalid'
    : '';

  return (
    <div className={`input-field blue-text darken-1 ${validationClass}`}>
      <input
        ref={props.inputRef}
        id={props.id}
        name={props.name}
        type={props.type}
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.onChange}
      />
      <label className="active" htmlFor={props.id}>{props.labelText}</label>
      {props.helpText && (<span className="helper-text">{props.helpText}</span>)}
    </div>
  );
};

export default TextBox;
