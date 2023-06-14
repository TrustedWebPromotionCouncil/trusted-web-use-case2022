import React, { FunctionComponent, InputHTMLAttributes } from 'react';
import classNames from 'classnames';

import './inputText.scss';

interface InputTextProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const InputText: FunctionComponent<InputTextProps> = ({ ...props }) => {
  const { className, label, error } = props;
  return (
    <div className="input-text">
      <input type="text" {...props} className={classNames('form-control', className)} />
      <div className="error-container">{error != null && <label className="error-text">{error}</label>}</div>
    </div>
  );
};
