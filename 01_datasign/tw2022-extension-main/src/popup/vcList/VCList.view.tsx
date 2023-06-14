import React, { FunctionComponent } from "react";

import { Header, CopyIcon } from "@/shared/components";

import "./vcList.scss";
import { DIDState } from "@/did/types";

export type VCType = "ad" | "notBot" | "mailAddress";
interface AdVC {
  type: "ad";
  id: string;
  usage: string[];
}
interface NotBotVC {
  type: "notBot";
  name: string;
  agent: { name: string };
  result: boolean;
}
interface MailAddressVC {
  type: "mailAddress";
  mailAddress: string;
}
export type VC = AdVC | NotBotVC | MailAddressVC;
export interface ProvidedHistoryForView {
  vcType: VCType;
  recipient: {
    did: string;
    url: string;
    pairwiseAccount: Omit<DIDState, "ops">;
  };
  vc: VC;
  date: string;
}
export interface VCListNonBotViewProps {
  vcType: VCType;
  histories?: ProvidedHistoryForView[];
  onBack: () => void;
}

const VCContent: FunctionComponent<{ vc: VC }> = (props) => {
  const { vc } = props;
  const { type } = vc;
  if (type === "ad") {
    const { id, usage } = vc;
    return (
      <div className="">
        <div className="log">
          <div className="log-caption">Id</div>
          <div className="log-value">{id}</div>
        </div>
        <div className="log">
          <div className="log-caption">Usage</div>
          <div className="log-value">{usage.join(",")}</div>
        </div>
      </div>
    );
  } else if (type === "notBot") {
    const { name, agent, result } = vc;
    return (
      <div className="">
        <div className="log">
          <div className="log-caption">Name</div>
          <div className="log-value">{name}</div>
        </div>
        <div className="log">
          <div className="log-caption">Agent</div>
          <div className="log-value">
            <span className="d-inline-block text-truncate">{agent.name}</span>
            <CopyIcon value={agent.name} />
          </div>
        </div>
        <div className="log">
          <div className="log-caption">Result</div>
          <div className="log-value">{result.toString()}</div>
        </div>
      </div>
    );
  } else {
    const { mailAddress } = vc;
    return (
      <div className="">
        <div className="log">
          <div className="log-caption">EMail</div>
          <div className="log-value">{mailAddress}</div>
        </div>
      </div>
    );
  }
};
export const VCListView: FunctionComponent<VCListNonBotViewProps> = (props) => {
  const { vcType, histories, onBack } = props;
  if (!histories) {
    return <div>no histories exist</div>;
  }
  const title =
    vcType === "notBot"
      ? "非ボット"
      : vcType === "ad"
      ? "広告識別子"
      : "メールアドレス";
  return (
    <>
      <Header title={title} onBack={onBack} />
      <div className="list-group p-2">
        {histories
          // .filter((h) => h.vcType === "notBot")
          .map((h) => {
            const { date, recipient, vc } = h;
            return (
              <div className="providing-log card mt-1">
                <div className="card-body">
                  <div className="log-caption">提供先</div>
                  <div className="log">
                    <div className="log-caption">日時</div>
                    <div className="log-value">
                      {new Date(date).toLocaleString()}
                    </div>
                  </div>
                  <div className="log">
                    <div className="log-caption">URL</div>
                    <div className="log-value">{recipient.url}</div>
                  </div>
                  <div className="log">
                    <div className="log-caption">DID</div>
                    <div className="log-value">
                      <span className="d-inline-block text-truncate">
                        {recipient.did}
                      </span>
                      <CopyIcon value={recipient.did} />
                    </div>
                  </div>
                  <div className="log">
                    <div className="log-caption">Pairwise Account</div>
                    <div className="log-value">
                      <span className="d-inline-block text-truncate">
                        {recipient.pairwiseAccount.longForm}
                      </span>
                      <CopyIcon value={recipient.did} />
                    </div>
                  </div>
                  <hr />
                  <div>
                    <div className="log-caption">証明内容</div>
                    <VCContent vc={vc} />
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
};
