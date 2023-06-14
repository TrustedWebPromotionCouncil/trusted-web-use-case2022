import React, { FunctionComponent, useCallback } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import _ from "lodash";
import "./adIdAllowConfirm.scss";
import { Button, Header, InputCheck } from "../../shared/components";
import { AdUsage } from "../../store/types";

export interface AdIdAllowConfirmViewProps {
  sendMessage(status: string, adIdUsage?: AdUsage[]): Promise<any>;
}
const FormSchema = yup.object().shape({
  status: yup.string().required(),
});

export const AdIdAllowConfirmView: FunctionComponent<AdIdAllowConfirmViewProps> =
  (props) => {
    const adIdUsage: AdUsage[] = [];
    const status: string = "";
    const { sendMessage } = props;
    const formik = useFormik({
      initialValues: {
        status,
        adIdUsage,
      },
      validationSchema: FormSchema,
      onSubmit: () => {
        sendMessage(formik.values.status, formik.values.adIdUsage).then();
      },
    });
    const handleSubmit = useCallback(
      _.throttle(formik.handleSubmit, 3000, { trailing: false }),
      []
    );

    return (
      <>
        <Header title="同意確認" />
        <div className="content">
          <div className="description">
            このサイトでは認証情報が確認できませんでした。以下の用途での広告識別子の利用を許可しますか？
          </div>
          <form className="form" onSubmit={handleSubmit}>
            <div className="adid-type-setting">
              <InputCheck
                id="advertiser"
                name="isProvideAdidPerSite"
                type="checkbox"
                label="広告の表示や、行動や属性に基づいたターゲティング広告のための分析、広告表示回数の制御、広告効果の測定等での利用"
                value="advertiser"
                checked={formik.values.adIdUsage.includes("advertiser")}
                onChange={formik.handleChange("adIdUsage")}
              />
            </div>
            <div className="adid-type-setting">
              <InputCheck
                id="analytics"
                name="isProvideAdidPerSite"
                type="checkbox"
                label="アクセス回数や滞在時間、利用環境や地域毎の利用者数、流入経路や検索語句等を分析し、利便性の向上やコンテンツの最適化等での利用"
                value="analytics"
                checked={formik.values.adIdUsage.includes("analytics")}
                onChange={formik.handleChange("adIdUsage")}
              />
            </div>
            <div className="bottom-container allow-confirm">
              <Button
                type="submit"
                onClick={() => {
                  formik.setFieldValue("status", "allow");
                }}
              >
                チェックした用途を許可
              </Button>
              <Button
                type="submit"
                onClick={() => {
                  formik.setFieldValue("status", "denied");
                  formik.setFieldValue("adIdUsage", []);
                }}
              >
                すべて拒否
              </Button>
            </div>
          </form>
        </div>
      </>
    );
  };
