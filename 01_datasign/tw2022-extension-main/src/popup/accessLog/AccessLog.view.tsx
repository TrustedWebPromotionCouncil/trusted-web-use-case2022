import React, { FunctionComponent } from "react";
import { Spinner } from "react-bootstrap";

import { CopyIcon, Header } from "@/shared/components";
import { AccessLog } from "@/store";
import "./accessLog.scss";

export interface AccessLogViewProps {
  onBack: () => void;
  accessLogs?: AccessLog[];
  loading?: boolean;
  urlMap?: { [key: string]: string };
}
export const AccessLogView: FunctionComponent<AccessLogViewProps> = (props) => {
  const { onBack, accessLogs, urlMap, loading } = props;
  if (loading) {
    return (
      <div className="d-flex justify-content-center">
        <Spinner
          as={"span"}
          animation={"border"}
          variant={"primary"}
          role={"status"}
          aria-hidden={"true"}
        />
      </div>
    );
  }
  if (!accessLogs || accessLogs.length === 0) {
    return (
      <div>
        <Header title="アクセス履歴" onBack={onBack} />
        <div className="no-log mt-5">アクセス履歴はありません</div>
      </div>
    );
  }
  return (
    <div className="access-log-list">
      <Header title="アクセス履歴" onBack={onBack} />
      {accessLogs && (
        <div className="p-2">
          <div className="list-group">
            {accessLogs.map((p) => {
              return (
                <div className="list-group-item">
                  <div className="log">
                    <div className="log-caption">アクセス日時</div>
                    <div className="log-value">
                      {new Date(p.date).toLocaleString()}
                    </div>
                  </div>
                  <div className="log">
                    <div className="log-caption">データ種別</div>
                    <div className="log-value">{p.schema}</div>
                  </div>
                  <div className="log">
                    <div className="log-caption">企業DID</div>
                    <div className="log-value">
                      <span className="did d-inline-block text-truncate">
                        {p.accessor}
                      </span>
                      <CopyIcon value={p.accessor} />
                    </div>
                  </div>
                  {urlMap && (
                    <div className="log">
                      <div className="log-caption">URL</div>
                      <div className="log-value">{urlMap[p.accessor]}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
