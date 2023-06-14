import React, { FunctionComponent, useCallback } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import _ from "lodash";
import { Button, Header, CopyIcon, Link } from "@/shared/components";
import "./masterDID.scss";

export interface MasterDIDViewProps {
  masterDID: string;
  onNext: () => void;
  onBack: () => void;
}
// const FormSchema = yup.object().shape({
//   password: yup.string().required(),
//   passwordConfirm: yup.string().required(),
// })

export const MasterDIDView: FunctionComponent<MasterDIDViewProps> = (props) => {
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
  const { masterDID, onNext, onBack } = props;

  // const masterDID =
  //   "did:ion:hogehogehogehogehogehogehogehogehogehogehogehogehogehoge";
  return (
    <>
      <Header title="マスターDID" onBack={onBack} />
      <div className="content">
        <div className="description">
          このウォレットのマスターDIDです。このDIDが提供されることはありません。
        </div>
        <div className="master-did">
          {masterDID}
          <span className="copy">
            <CopyIcon value={masterDID} />
          </span>
        </div>
        <div className="bottom-container">
          <Link>DID Documentを確認する</Link>
          <Button onClick={() => onNext()}>次へ</Button>
        </div>
      </div>
    </>
  );
};
