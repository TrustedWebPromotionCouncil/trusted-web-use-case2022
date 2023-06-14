import React, { FunctionComponent, HtmlHTMLAttributes } from "react";
import classNames from "classnames";

import "./link.scss";

interface LinkProps extends HtmlHTMLAttributes<HTMLDivElement> {
}

export const Link: FunctionComponent<LinkProps> = ({
  children,
  ...props
}) => {
  return (
      <a className={classNames('text-styles-link')}>
        {children}
      </a>
  );
};
