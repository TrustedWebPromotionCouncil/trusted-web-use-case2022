import React, {
  FunctionComponent,
  InputHTMLAttributes,
  ReactNode,
} from "react";
import { FormikErrors } from "formik";
import classNames from "classnames";

import "./inputText.scss";

interface InputTextProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  containerClass?: string;
}

export const InputText: FunctionComponent<InputTextProps> = ({ ...props }) => {
  const { className, label, error, icon, containerClass } = props;
  return (
    <div className="input-text">
      {/*<div className="input-text-group">*/}
      <div className={classNames("input-text-group", containerClass)}>
        <input
          {...props}
          className={classNames("form-control", className)}
        />
        {icon ?? icon}
      </div>
      <div className="error-container">
        {error && <label className="error-text">{error}</label>}
      </div>
      {label && <label className="input-description">{label}</label>}
    </div>
  );
};
