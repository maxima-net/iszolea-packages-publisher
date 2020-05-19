import React from 'react';

export interface ButtonProps {
  text?: string;
  color: 'red' | 'blue' | 'green' | 'light-green' | 'deep-orange' | 'teal' | 'blue-grey' | 'pink' | 'purple' | 'light-blue';
  onClick?: () => void;
  icon?: string;
  isHidden?: boolean;
  isDisabled?: boolean;
  title?: string;
  type?: string;
  className?: string;
}

const Button: React.FC<ButtonProps> = (options) => (
  <button
    className={`waves-effect waves-light btn darken-1 ${options.color}${options.isHidden ? ' hide' : ''} ${options.className ? options.className : ''}`}
    type={options.type}
    disabled={options.isDisabled}
    onClick={options.onClick}
    title={options.title}>
    {options.icon && <i className="material-icons left">{options.icon}</i>}
    {options.text}
  </button>
);

export default React.memo(Button);
