import React, { FunctionComponent, ButtonHTMLAttributes } from "react";
import classNames from "classnames";

import "./button.scss";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
}

export const Button: FunctionComponent<ButtonProps> = ({
  children,
  ...props
}) => {
  const { className, onClick, ...rest } = props;
  return (
      <button
          className={classNames('button text-styles-button', className)}
          onClick={onClick}
          disabled={props.disabled}
      >
        {children}
      </button>
  );
};
