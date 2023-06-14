import React, { FunctionComponent } from "react";
import { FaChevronRight } from "react-icons/fa";

import { VerifiedFirstParty } from "../../../../bundles/src/types";
import { Header, VerifiedInfo } from "@/shared/components";

import "./verifyResultList.scss";

export interface VerifyResultListViewProps {
  results: VerifiedFirstParty[];
  onClick: (id: string) => void;
  onBack: () => void;
}

export const VerifyResultListView: FunctionComponent<VerifyResultListViewProps> =
  (props) => {
    const { results, onClick, onBack } = props;
    return (
      <div className="verified-result-list">
        <Header title={"検証結果一覧"} onBack={onBack} />
        <div className="p-2">
          <table className="table">
            <tbody>
              {results &&
                results.map((result) => {
                  const { id, date, verified, url } = result;
                  return (
                    <tr key={id} onClick={() => onClick(id)}>
                      <td>
                        <VerifiedInfo
                          verified={verified === "ok"}
                          noStatement={true}
                        />
                      </td>
                      <td valign="middle">
                        <div className="log-value">
                          {new Date(date).toLocaleString(undefined, {
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                          })}
                        </div>
                      </td>
                      <td valign="middle">
                        <div className="log-value">
                          <span className="url text-truncate">{url}</span>
                        </div>
                      </td>
                      <td>
                        <FaChevronRight className="chevron" />
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
