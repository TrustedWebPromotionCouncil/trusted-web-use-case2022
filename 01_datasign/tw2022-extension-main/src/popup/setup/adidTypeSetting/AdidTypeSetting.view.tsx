import React, { FunctionComponent, useCallback, useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import _ from "lodash";
import { Button, Header, InputCheck } from "@/shared/components";
import "./adidTypeSetting.scss";

export interface AdidTypeSettingViewProps {
  adIdOfferType: "by_1st_party" | "global" | undefined;
  onSubmit: (adIdOfferType: "by_1st_party" | "global") => void;
  onBack: () => void;
}
const FormSchema = yup.object().shape({
  adIdOfferType: yup.string().required(),
});

export const AdidTypeSettingView: FunctionComponent<AdidTypeSettingViewProps> =
  (props) => {
    const { adIdOfferType, onSubmit, onBack } = props;

    const formik = useFormik({
      initialValues: {
        adIdOfferType,
      },
      validationSchema: FormSchema,
      onSubmit: ({ adIdOfferType }) => onSubmit(adIdOfferType!),
    });
    const handleSubmit = useCallback(
      _.throttle(formik.handleSubmit, 3000, { trailing: false }),
      []
    );
    useEffect(() => {
      formik.setValues({ adIdOfferType });
    }, [adIdOfferType]);
    const radioItems = [
      {
        text: "",
        value: "by_1st_party",
      },
      {
        text: "",
        value: "global",
      },
    ];
    return (
      <>
        <Header title="広告識別子設定" onBack={onBack} />
        <div className="content">
          <div className="description">
            サイト閲覧時に設定する広告識別子の種類
          </div>
          <form className="form" onSubmit={handleSubmit}>
            <div className="adid-type-setting">
              <InputCheck
                id="by_1st_party"
                name="adIdOfferType"
                type="radio"
                value="by_1st_party"
                label="閲覧サイト毎に異なった広告識別子を提供する"
                checked={formik.values.adIdOfferType === "by_1st_party"}
                error={formik.errors.adIdOfferType}
                onChange={formik.handleChange("adIdOfferType")}
              />
            </div>
            <div className="adid-type-setting">
              <InputCheck
                id="global"
                name="adIdOfferType"
                type="radio"
                value="global"
                label="すべての提供先に同じ広告識別子を提供する"
                checked={formik.values.adIdOfferType === "global"}
                error={formik.errors.adIdOfferType}
                onChange={formik.handleChange("adIdOfferType")}
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
