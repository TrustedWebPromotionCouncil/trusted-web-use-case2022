import React, {FunctionComponent, useCallback} from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import _ from "lodash";
import {Button, Header, CopyIcon} from "@/shared/components"
import "./showVC.scss";

export interface ShowVCViewProps {
  onNext: () => void;
  onBack: () => void;
}
// const FormSchema = yup.object().shape({
//   password: yup.string().required(),
//   passwordConfirm: yup.string().required(),
// })

export const ShowVCView: FunctionComponent<ShowVCViewProps> = (props) => {
  // const { onSubmit, onBack } = props;
  // const formik = useFormik({
  //   initialValues: {
  //     password: "",
  //     passwordConfirm: "",
  //   },
  //   validationSchema: FormSchema,
  //   onSubmit: ({ password, passwordConfirm }) => onSubmit(password, passwordConfirm),
  // });
  // const handleSubmit = useCallback(
  //     _.throttle(formik.handleSubmit, 3000, { trailing: false }),
  //     []
  // );
  const { onNext, onBack } = props;

  const VC = '（VCの内容を表示）';
  return (
    <>
      <Header title="非ボット証明" onBack={onBack} />
      <div className="content" >
        <div className="description">非ボット証明書が作成され、DWNに保存されました。</div>
        <div className="master-did">
          {VC}
          <span className="copy"><CopyIcon value={VC} /></span>
        </div>
        <div className="bottom-container">
          <Button onClick={() => onNext()}>次へ</Button>
        </div>
      </div>
    </>
  );
};
