import React, { FunctionComponent } from "react";

import { Button, Link } from "@/shared/components"

import "./welcome.scss";
import logo_icon from "@/assets/logo_icon.png";

export interface WelcomeViewProps {
  onNext: () => void;
  onBack: () => void;
}

export const WelcomeView: FunctionComponent<WelcomeViewProps> = (props) => {
  const { onNext } = props;
  return (
    <>
      <div className="top-container" >
        <div>
          <img
              src={logo_icon}
              alt="logo"
              className="logo-icon-welcome"
          />
        </div>
        <div className="title">Bunsin DID wallet (β)</div>
      </div>
      <div className="content" >
        <div className="description">Bunsin DIDウォレット（β）は、DID（ION）とDWN（Decentalized Web Node）、Bunsinとの連携により、自分のパーソナルデータを管理し、安心安全なウェブ体験を提供します。</div>
        <div className="description">秘密鍵はエクステンション内のみに保存され、パーソナルデータはDWNに保存されます。</div>
        <div className="bottom-container">
          <Button onClick={() => onNext()}>新しくはじめる</Button>
          <Link>インポート・復元する</Link>
        </div>
      </div>
    </>
  );
};
