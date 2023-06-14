import React, {FunctionComponent, useCallback} from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import _ from "lodash";
import {Button, Header, CopyIcon} from "@/shared/components"
import "./setupDone.scss";

export interface SetupDoneViewProps {
  onNext: () => void;
  onBack: () => void;
}

export const SetupDoneView: FunctionComponent<SetupDoneViewProps> = (props) => {
  const { onNext, onBack } = props;

  return (
    <>
      <Header title="設定完了" onBack={onBack} />
      <div className="content" >
        <div className="bottom-container">
          <Button onClick={() => onNext()}>次へ</Button>
        </div>
      </div>
    </>
  );
};
