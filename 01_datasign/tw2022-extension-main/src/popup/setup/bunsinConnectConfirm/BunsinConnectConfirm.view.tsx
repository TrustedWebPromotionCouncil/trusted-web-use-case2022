import React, {FunctionComponent, useCallback, useState} from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import _ from "lodash";
import { Button, Header, InputText } from "@/shared/components"
import "./bunsinConnectConfirm.scss";
import AuthCode from 'react-auth-code-input';

export interface BunsinConnectConfirmViewProps {
  onSubmit: (authCode: string) => void;
  onBack: () => void;
}
const FormSchema = yup.object().shape({
  authCode: yup.string().length(6),
})

export const BunsinConnectConfirmView: FunctionComponent<BunsinConnectConfirmViewProps> = (props) => {
  const { onSubmit, onBack } = props;
  const formik = useFormik({
    initialValues: {
      authCode: "",
    },
    validationSchema: FormSchema,
    onSubmit: ({ authCode }) => onSubmit(authCode),
  });
  const handleSubmit = useCallback(
      _.throttle(formik.handleSubmit, 3000, { trailing: false }),
      []
  );
  const [result, setResult] = useState('');
  const handleOnChange = (res: string) => {
    setResult(res);
  };
  return (
    <>
      <Header title="Bunsin連携" onBack={onBack} />
      <div className="content" >
        <div className="description">
          <div>Bunsinのアカウントメールアドレスに届いた6桁の認証番号を入力してください。</div>
        </div>
        <form className="form" onSubmit={handleSubmit}>
          <div>
            <AuthCode
                containerClassName="code-input"
                allowedCharacters='numeric'
                onChange={formik.handleChange("authCode")}
            />
          </div>
          <div className="bottom-container">
            <Button
                type="submit"
                disabled={!formik.dirty || !formik.isValid}
                data-testid="next"
            >
             認証する
            </Button>
          </div>
        </form>

      </div>
    </>
  );
};
