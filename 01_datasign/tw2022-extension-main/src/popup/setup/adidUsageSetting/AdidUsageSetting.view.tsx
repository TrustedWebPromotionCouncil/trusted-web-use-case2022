import React, { FunctionComponent, useCallback, useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import _ from "lodash";
import { Button, Header, InputCheck, InputText } from "@/shared/components";
import "./adidUsageSetting.scss";
import { AdUsage } from "@/store/types";

export interface AdidUsageSettingViewProps {
  adIdUsage: AdUsage[];
  onSubmit: (adIdUsage: AdUsage[]) => void;
  onBack: () => void;
}
const FormSchema = yup.object().shape({
  adIdUsage: yup.array().required(),
});

export const AdidUsageSettingView: FunctionComponent<AdidUsageSettingViewProps> =
  (props) => {
    const { adIdUsage, onSubmit, onBack } = props;

    const formik = useFormik({
      initialValues: {
        adIdUsage,
      },
      validationSchema: FormSchema,
      onSubmit: ({ adIdUsage }) => {
        onSubmit(adIdUsage!);
      },
    });
    const handleSubmit = useCallback(
      _.throttle(formik.handleSubmit, 3000, { trailing: false }),
      []
    );
    useEffect(() => {
      formik.setValues({ adIdUsage });
    }, [adIdUsage]);

    return (
      <>
        <Header title="広告識別子設定" onBack={onBack} />
        <div className="content">
          <div className="description">広告識別子の用途の設定</div>
          <form className="form" onSubmit={handleSubmit}>
            <div className="adid-type-setting">
              <InputCheck
                id="advertiser"
                name="isProvideAdidPerSite"
                type="checkbox"
                label="広告の表示や、行動や属性に基づいたターゲティング広告のための分析、広告表示回数の制御、広告効果の測定等での利用"
                value="advertiser"
                checked={formik.values.adIdUsage.includes("advertiser")}
                error={formik.errors.adIdUsage}
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
                error={formik.errors.adIdUsage}
                onChange={formik.handleChange("adIdUsage")}
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
