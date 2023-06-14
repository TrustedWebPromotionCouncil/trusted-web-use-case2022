import React, {FunctionComponent, useCallback} from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import _ from "lodash";
import { Button, Header, InputText } from "@/shared/components"
import "./inputPassword.scss";

export interface InputPasswordViewProps {
  onSubmit: (password: string, passwordConfirm: string) => void;
  onBack: () => void;
}
const FormSchema = yup.object().shape({
  password: yup.string().required(),
  passwordConfirm: yup.string().required(),
})

export const InputPasswordView: FunctionComponent<InputPasswordViewProps> = (props) => {
  const { onSubmit, onBack } = props;
  const formik = useFormik({
    initialValues: {
      password: "",
      passwordConfirm: "",
    },
    validationSchema: FormSchema,
    onSubmit: ({ password, passwordConfirm }) => onSubmit(password, passwordConfirm),
  });
  const handleSubmit = useCallback(
      _.throttle(formik.handleSubmit, 3000, { trailing: false }),
      []
  );
  return (
    <>
      <Header title="パスワード設定" onBack={onBack} />
      <div className="content" >
        <div className="description">ウォレットのパスワードを設定してください。このパスワードは秘密鍵のアンロックに用いられます。</div>
        <form className="form" onSubmit={handleSubmit}>
          <div className="password">
            <InputText
                placeholder='Password'
                label='※12文字以上'
                type="password"
                value={formik.values.password}
                error={formik.errors.password}
                onChange={formik.handleChange("password")}
                data-testid="password"
            />
            <InputText
                placeholder='Confirm'
                type="password"
                value={formik.values.passwordConfirm}
                error={formik.errors.passwordConfirm}
                onChange={formik.handleChange("passwordConfirm")}
                data-testid="passwordConfirm"
            />
          </div>
          <div className="bottom-container">
            <Button
                type="submit"
                disabled={!formik.dirty || !formik.isValid}
                data-testid="next"
            >
              次へ
            </Button>
          </div>
        </form>

      </div>
    </>
  );
};
