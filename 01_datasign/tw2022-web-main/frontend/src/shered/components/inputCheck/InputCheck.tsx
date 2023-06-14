import React, { FunctionComponent, InputHTMLAttributes } from 'react';

import { FormikErrors } from 'formik';
import classNames from 'classnames';

import './inputCheck.scss';

interface InputCheckProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string | string[] | FormikErrors<unknown> | Array<FormikErrors<unknown>>;
  name: string;
  label: string;
  onChangeValue?: (selected: string) => void;
}

export const InputCheck: FunctionComponent<InputCheckProps> = ({ ...props }) => {
  const { id, className, name, label, type, onChangeValue, ...rest } = props;
  return (
    <>
      <div className={classNames('form-check text-styles-radio', className)}>
        <input id={id} className="form-check-input" type={type} name={name} {...rest} />
        <label className="form-check-label" htmlFor={id}>
          {label}
        </label>
      </div>
    </>
  );
};
