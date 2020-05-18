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
}

const Button: React.FC<ButtonProps> = ({ text, onClick, icon, color, isHidden, isDisabled, title, type }) => (
  <button
    className={`waves-effect waves-light btn darken-1 ${color}${isHidden ? ' hide' : ''}`}
    type={type}
    disabled={isDisabled}
    onClick={onClick}
    title={title}>
    {icon && <i className="material-icons left">{icon}</i>}
    {text}
  </button>
);

export default React.memo(Button);
