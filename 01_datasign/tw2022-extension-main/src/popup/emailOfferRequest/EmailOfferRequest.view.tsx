import React, { FunctionComponent, useCallback } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import _ from "lodash";
import { Button, Header, InputText, Link } from "../../shared/components";
import "./emailOfferRequest.scss";
import bunsin_icon from "../../assets/bunsin_icon.png";
import { originatorProfileInThePage } from "@/popup/emailOfferRequest/EmailOfferRequest";

export interface EmailOfferRequestViewProps {
  error: string;
  hasBunsin: boolean;
  sendMessage(status: string, email: string): Promise<any>;
  requestCreateAlterEgo(name: string): Promise<string>;
  originatorProfile: originatorProfileInThePage | undefined;
}
const FormSchema = yup.object().shape({
  status: yup.string().required(),
});

export const EmailOfferRequestView: FunctionComponent<EmailOfferRequestViewProps> =
  (props) => {
    const status: string = "";
    const email: string = "";
    const {
      error,
      hasBunsin,
      sendMessage,
      requestCreateAlterEgo,
      originatorProfile,
    } = props;
    const formik = useFormik({
      initialValues: {
        status,
        email,
      },
      validationSchema: FormSchema,
      onSubmit: () => {
        sendMessage(formik.values.status, formik.values.email).then();
      },
    });
    const handleSubmit = useCallback(
      _.throttle(formik.handleSubmit, 3000, { trailing: false }),
      []
    );
    const onBunsinLink = async () => {
      const email = await requestCreateAlterEgo("alter-ego-test");
      console.debug("email => " + email);
      await formik.setFieldValue("email", email);
    };
    return (
      <>
        <Header title="メールアドレス提供" />
        <div className="content">
          <div className="description">
            <div>このサイトからメールアドレスの提供を求められています。</div>
          </div>
          <div className="offer-detail">
            <div>提供先</div>
            <div>：{originatorProfile?.firstParty.name}&#9989;</div>
            <div>利用目的</div>
            <div>：プライバシーポリシーページをご確認ください。</div>
          </div>
          {error && <div className="page-error-text">{error}</div>}
          <form className="form" onSubmit={handleSubmit}>
            <div>
              <InputText
                placeholder="Email"
                type="input"
                value={formik.values.email}
                error={formik.errors.email}
                onChange={formik.handleChange("email")}
                data-testid="email"
                icon={
                  hasBunsin && (
                    <span className="bunsin-link" onClick={onBunsinLink}>
                      <span className="icon-circle" />
                      <img
                        src={bunsin_icon}
                        alt="logo"
                        className="bunsin-icon-input"
                      />
                    </span>
                  )
                }
                className="email-input"
                containerClass="email-input-container"
              />
            </div>
            <div className="bottom-container-row">
              <Button
                type="submit"
                onClick={() => {
                  formik.setFieldValue("status", "denied");
                  formik.setFieldValue("email", "");
                }}
              >
                拒否
              </Button>
              <Button
                type="submit"
                onClick={() => {
                  formik.setFieldValue("status", "allow");
                }}
              >
                提供する
              </Button>
            </div>
          </form>
        </div>
      </>
    );
  };
