import React, { FunctionComponent, useCallback } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import _ from "lodash";
import { Button, Header, InputText, Link } from "@/shared/components";
import "./bunsinConnect.scss";
import bunsin_icon from "@/assets/bunsin_icon.png";
import bunsin_title from "@/assets/bunsin_title.png";

export interface BunsinConnectViewProps {
  onSubmit: (email: string) => void;
  onBack: () => void;
}
const FormSchema = yup.object().shape({
  email: yup.string().required(),
});

export const BunsinConnectView: FunctionComponent<BunsinConnectViewProps> = (
  props
) => {
  const { onSubmit, onBack } = props;
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: FormSchema,
    onSubmit: ({ email }) => onSubmit(email),
  });
  const handleSubmit = useCallback(
    _.throttle(formik.handleSubmit, 3000, { trailing: false }),
    []
  );
  return (
    <>
      <Header title="Bunsin連携" onBack={onBack} />
      <div className="content">
        <div className="description">
          <div>
            Bunsinと連携し、メールアドレス提供時にブンシンメールアドレスの作成を可能にします。
          </div>
          <div>Bunsinのアカウントメールアドレスを入力してください。</div>
        </div>
        <form className="form" onSubmit={handleSubmit}>
          <div className="email">
            <InputText
              placeholder="Email"
              type="input"
              value={formik.values.email}
              error={formik.errors.email}
              onChange={formik.handleChange("email")}
              data-testid="email"
            />
          </div>
          <div>
            <span className="bunsin">
              <img
                src={bunsin_icon}
                alt="logo"
                className="bunsin-icon"
                data-testid="logout"
              />
              <img
                src={bunsin_title}
                alt="logo"
                className="bunsin-title"
                data-testid="logout"
              />
              <span>とは？</span>
            </span>
            <div className="bunsin-description">
              ※ BunsinのアカウントはBunsinのスマホアプリから無料で作成できます。
            </div>
          </div>
          <div className="bottom-container">
            <Button
              type="submit"
              disabled={!formik.dirty || !formik.isValid}
              data-testid="next"
            >
              連携
            </Button>
            <Link>スキップ</Link>
          </div>
        </form>
      </div>
    </>
  );
};
