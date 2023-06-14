import React, { FunctionComponent } from "react";

import { Header, VerifiedInfo } from "@/shared/components";

import "./verifyResultCurrent.scss";
import {
  Party,
  VerifiedFirstParty,
  VerifiedResultHasOpDoc,
} from "../../../../bundles/src/types";

export interface VerifyResultCurrentViewProps {
  result?: VerifiedFirstParty;
  onBack: () => void;
}

export const VerifyResultCurrentView: FunctionComponent<VerifyResultCurrentViewProps> =
  (props) => {
    const { result, onBack } = props;
    if (!result) {
      return (
        <div>
          <Header title={"現在のサイト"} onBack={onBack} />
          <div className="no-current-site mt-5">閲覧中のサイトはありません</div>
        </div>
      );
    }
    const { date, url, verified, did, thirdParties } = result;
    if (verified === "ok" || verified === "ng") {
      const { originatorProfile } = result;
    } else {
    }
    return (
      <div className="verified-result-current">
        <Header title={"現在のサイト"} onBack={onBack} />
        <div className="p-2">
          <div className="card">
            <div className="card-body py-1">
              <div className="log">
                <VerifiedInfo
                  verified={verified === "ok"}
                  okStatement={"このサイトの組織は認証されています"}
                  ngStatement={"このサイトの組織は認証されていません"}
                />
              </div>
              <div className="log">
                <div className="log-caption">検証日時</div>
                <div>{new Date(date).toLocaleString()}</div>
              </div>
              <div className="log">
                <div className="log-caption">url</div>
                <div className="text-break">{url}</div>
              </div>
              {did && (
                <div className="log">
                  <div className="log-caption">did</div>
                  <div>{did}</div>
                </div>
              )}
            </div>
          </div>
          {thirdParties && 0 < thirdParties.length && (
            <span className="text-styles-caption">3rd Party Site</span>
          )}
          {thirdParties && (
            <div>
              {thirdParties
                .filter(
                  (p): p is Party & VerifiedResultHasOpDoc =>
                    p.verified === "ok" || p.verified === "ng"
                )
                .map((p) => {
                  return (
                    <div key={p.id} className="card mt-1">
                      <div className="card-body py-1">
                        <div className="log">
                          <VerifiedInfo
                            verified={p.verified === "ok"}
                            okStatement={"この通信の組織は認証されています"}
                            ngStatement={"この通信の組織は認証されていません"}
                          />
                        </div>
                        <div className="log">
                          <div className="log-caption">url</div>
                          <div>{p.originatorProfile.sub}</div>
                        </div>
                        <div className="log">
                          <div className="log-caption">did</div>
                          <div>{p.did}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    );
  };
