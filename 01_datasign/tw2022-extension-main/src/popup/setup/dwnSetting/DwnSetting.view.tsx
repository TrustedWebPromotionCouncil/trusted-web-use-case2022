import React, { FunctionComponent, useCallback, useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import _ from "lodash";
import { Button, Header, InputCheck, InputText } from "@/shared/components";
import "./dwnSetting.scss";

export interface DwnSettingViewProps {
  dwnLocation: string;
  dwnLocationURL: string;
  onSubmit: (dwnLocation: string, dwnLocationURL: string) => void;
  onBack: () => void;
}
const FormSchema = yup.object().shape({
  dwnLocation: yup.string().required(),
  dwnLocationURL: yup.string().when("dwnLocation", {
    is: "custom",
    then: yup.string().required(),
    otherwise: yup.string().strip(),
  }),
});

export const DwnSettingView: FunctionComponent<DwnSettingViewProps> = (
  props
) => {
  const { dwnLocation, dwnLocationURL, onSubmit, onBack } = props;

  const formik = useFormik({
    initialValues: {
      dwnLocation,
      dwnLocationURL,
    },
    validationSchema: FormSchema,
    onSubmit: ({ dwnLocation, dwnLocationURL }) =>
      onSubmit(dwnLocation, dwnLocationURL),
  });
  const handleSubmit = useCallback(
    _.throttle(formik.handleSubmit, 3000, { trailing: false }),
    []
  );
  useEffect(() => {
    formik.setValues({ dwnLocation, dwnLocationURL });
  }, [dwnLocation, dwnLocationURL]);
  return (
    <>
      <Header title="DWN設定" onBack={onBack} />
      <div className="content">
        <div className="description">
          Decentralized Web Node（DWN）
          のエンドポイントを指定してください。DWNにはパーソナルデータが保存されます。
        </div>
        <form className="form" onSubmit={handleSubmit}>
          <div className="dwn-setting">
            <InputCheck
              id="data-sign"
              name="dwnLocation"
              type="radio"
              label="DataSign提供のDWNを利用する"
              value="data-sign"
              checked={formik.values.dwnLocation === "data-sign"}
              error={formik.errors.dwnLocation}
              onChange={formik.handleChange("dwnLocation")}
            />
          </div>
          <div className="dwn-setting">
            <InputCheck
              id="custom"
              name="dwnLocation"
              type="radio"
              label="自分で指定する"
              value="custom"
              checked={formik.values.dwnLocation === "custom"}
              error={formik.errors.dwnLocation}
              onChange={formik.handleChange("dwnLocation")}
            />
          </div>
          <div className="input-endpoint">
            <InputText
              placeholder="https://"
              type="input"
              value={formik.values.dwnLocationURL}
              error={formik.errors.dwnLocationURL}
              onChange={formik.handleChange("dwnLocationURL")}
              data-testid="dwnLocationURL"
              className="form-control-sm"
              disabled={formik.values.dwnLocation === "data-sign"}
            />
          </div>
          <div className="bottom-container">
            <Button type="submit" disabled={!formik.isValid} data-testid="next">
              次へ
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};
