import React, { FunctionComponent, HtmlHTMLAttributes } from "react";
import classNames from "classnames";
import { FaChevronLeft } from "react-icons/fa";
import logo_icon from "../../../assets/logo_icon.png";

import "./header.scss";

interface HeaderProps extends HtmlHTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  onBack?: () => void;
}

export const Header: FunctionComponent<HeaderProps> = ({ title, ...props }) => {
  const { className, onBack } = props;
  return (
    <div className={classNames("header-container", className)}>
      <div className="header">
        <div className="back" onClick={onBack}>
          {onBack && <FaChevronLeft color="white" />}
        </div>
        <div className="title-area">
          <div className="title">{title}</div>
        </div>
        <div className="right-area">
          <img
            src={logo_icon}
            alt="logo"
            className="logo-icon"
            data-testid="logout"
          />
        </div>
      </div>
    </div>
  );
};
