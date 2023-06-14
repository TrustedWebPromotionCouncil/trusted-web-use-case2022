import React, { FunctionComponent, useCallback } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import _ from "lodash";
import { Button, Header, InputText } from "@/shared/components";
import "./ReInputPassword.scss";

export interface InputPasswordViewProps {
  error: string;
  onSubmit: (password: string) => void;
  onBack: () => void;
}
const FormSchema = yup.object().shape({
  password: yup.string().required(),
});

export const ReInputPasswordView: FunctionComponent<InputPasswordViewProps> = (
  props
) => {
  const { error, onSubmit, onBack } = props;
  const formik = useFormik({
    initialValues: {
      password: "",
    },
    validationSchema: FormSchema,
    onSubmit: ({ password }) => onSubmit(password),
  });
  const handleSubmit = useCallback(
    _.throttle(formik.handleSubmit, 3000, { trailing: false }),
    []
  );
  return (
    <>
      <Header title="パスワード入力" onBack={onBack} />
      <div className="content">
        <div className="description">
          パスワードを入力してウォレットをアンロックしてください。
        </div>
        {error && <div className="page-error-text">{error}</div>}
        <form className="form" onSubmit={handleSubmit}>
          <div className="password">
            <InputText
              placeholder="Password"
              type="password"
              value={formik.values.password}
              error={formik.errors.password}
              onChange={formik.handleChange("password")}
              data-testid="password"
            />
          </div>
          <div className="bottom-container">
            <Button
              type="submit"
              disabled={!formik.dirty || !formik.isValid}
              data-testid="next"
            >
              アンロック
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};
