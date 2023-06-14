import React, { FunctionComponent, HtmlHTMLAttributes } from 'react';
import classNames from 'classnames';

import './header.scss';

interface HeaderProps extends HtmlHTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
}

export const Header: FunctionComponent<HeaderProps> = ({ title, ...props }) => {
  const { className } = props;
  return (
    <div className={classNames('header-container', className)}>
      <div className="header">
        <div className="title-area">
          <div className="title">{title}</div>
        </div>
      </div>
    </div>
  );
};
