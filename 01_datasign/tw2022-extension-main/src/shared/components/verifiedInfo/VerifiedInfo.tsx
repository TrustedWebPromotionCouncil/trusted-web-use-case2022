import React, { FunctionComponent } from "react";
import { FaRegCheckCircle, FaExclamationCircle } from "react-icons/fa";

import "./verifiedInfo.scss";

interface VerifiedInfoProps {
  verified: boolean;
  infoName?: string;
  okStatement?: string;
  ngStatement?: string;
  noStatement?: boolean;
}
export const VerifiedInfo: FunctionComponent<VerifiedInfoProps> = (props) => {
  const { verified, infoName, okStatement, ngStatement, noStatement } = props;
  const _infoName = infoName ?? "情報";
  const _okStatement = okStatement ?? `この${_infoName}は検証ずみ`;
  const _ngStatement = ngStatement ?? `この${_infoName}は検証できませんでした`;
  return (
    <div className={verified ? "pass-text" : "not-pass-text"}>
      {verified && <FaRegCheckCircle />}
      {!verified && <FaExclamationCircle />}
      {!noStatement && verified && <span>{_okStatement}</span>}
      {!noStatement && !verified && <span>{_ngStatement}</span>}
    </div>
  );
};
