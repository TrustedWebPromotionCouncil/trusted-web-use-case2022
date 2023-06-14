import React, { FunctionComponent } from "react";

import { Header } from "@/shared/components";

export interface BlockingSettingViewProps {
  // rules: Rule[];
  rules: chrome.declarativeNetRequest.Rule[];
  onBack: () => void;
  onRestoreRules: () => void;
  onClearNonDefaultRules: () => void;
}

export const BlockingSettingView: FunctionComponent<BlockingSettingViewProps> =
  (props) => {
    const { rules, onBack, onRestoreRules, onClearNonDefaultRules } = props;
    return (
      <>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Id</th>
              <th scope="col">Action</th>
              <th scope="col">Domain Type</th>
              <th scope="col">Url Filter</th>
              <th scope="col">Initiator Domains</th>
            </tr>
          </thead>
          <tbody>
            {rules &&
              rules.map((rule) => {
                const {
                  urlFilter,
                  domainType,
                  excludedTabIds,
                  initiatorDomains,
                } = rule.condition;
                return (
                  <tr key={rule.id}>
                    <td>{rule.id}</td>
                    <td>{rule.action.type}</td>
                    <td>{domainType}</td>
                    <td>{urlFilter}</td>
                    <td>{initiatorDomains?.join(",")}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
        <button onClick={onRestoreRules}>restore rules</button>
        <button onClick={onClearNonDefaultRules}>reset rules</button>
      </>
    );
  };
