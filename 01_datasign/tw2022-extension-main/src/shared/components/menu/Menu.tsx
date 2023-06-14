import React, { FunctionComponent, HtmlHTMLAttributes } from "react";
import { FaChevronRight } from "react-icons/fa";
import classNames from "classnames";

import "./menu.scss";

interface MenuProps extends HtmlHTMLAttributes<HTMLDivElement> {
  label: string;
  onClick: () => void;
}

export const Menu: FunctionComponent<MenuProps> = ({
  label,
  onClick,
  ...props
}) => {
  const { className } = props;
  return (
      <div className="menu-container">
        <div className="menu" onClick={onClick}>
          <span>{label}</span>
          <FaChevronRight className="chevron" />
        </div>
      </div>
  );
};
