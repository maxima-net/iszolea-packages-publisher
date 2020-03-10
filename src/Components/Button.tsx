import React from 'react';

export interface ButtonProps {
  text?: string;
  color: 'red' | 'blue' | 'deep-orange' | 'teal';
  onClick?: () => void;
  icon?: string;
  isHidden?: boolean;
  isDisabled?: boolean;
  title?: string;
}

const Button: React.FC<ButtonProps> = ({ text, onClick, icon, color, isHidden, isDisabled, title }) => (
  <button
    className={`waves-effect waves-light btn darken-1 ${color}${isHidden ? ' hide' : ''}`}
    disabled={isDisabled}
    onClick={onClick}
    title={title}>
    {icon && <i className="material-icons left">{icon}</i>}
    {text}
  </button>
);

export default React.memo(Button);
