import React, { FunctionComponent, useCallback } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import _ from "lodash";

import { Button, Header, InputText } from "@/shared/components";
import { Setting } from "@/store";

export interface OptionViewProps {
  setting: Setting;
  onBack: () => void;
  onSubmit: (setting: Setting) => void;
}

const FormSchema = yup.object().shape({
  reCaptchaSiteHost: yup.string().required(),
  reCaptchaApiHost: yup.string().required(),
  accessLogTargetDid: yup.string().required(),
});

export const OptionView: FunctionComponent<OptionViewProps> = (props) => {
  const { setting, onSubmit, onBack } = props;
  const { reCaptchaSiteHost, reCaptchaApiHost, accessLogTargetDid } = setting;
  const formik = useFormik({
    initialValues: {
      reCaptchaSiteHost: reCaptchaSiteHost,
      reCaptchaApiHost: reCaptchaApiHost,
      accessLogTargetDid,
    },
    validationSchema: FormSchema,
    onSubmit: (setting) => onSubmit(setting),
  });
  const handleSubmit = useCallback(
    _.throttle(formik.handleSubmit, 3000, { trailing: false }),
    []
  );
  return (
    <>
      <form className="form" onSubmit={handleSubmit}>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">No</th>
              <th scope="col">Name</th>
              <th scope="col">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>reCaptchaSiteUrl</td>
              <td>
                <InputText
                  type="text"
                  value={formik.values.reCaptchaSiteHost}
                  error={formik.errors.reCaptchaSiteHost}
                  onChange={formik.handleChange("reCaptchaSiteHost")}
                />
              </td>
            </tr>
            <tr>
              <td>2</td>
              <td>reCaptchaApiUrl</td>
              <td>
                <InputText
                  type="text"
                  value={formik.values.reCaptchaApiHost}
                  error={formik.errors.reCaptchaApiHost}
                  onChange={formik.handleChange("reCaptchaApiHost")}
                />
              </td>
            </tr>
            <tr>
              <td>3</td>
              <td>accessLogTargetDid</td>
              <td>
                <InputText
                  type="text"
                  value={formik.values.accessLogTargetDid}
                  error={formik.errors.accessLogTargetDid}
                  onChange={formik.handleChange("accessLogTargetDid")}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <div className="bottom-container">
          <Button type="submit" disabled={!formik.dirty || !formik.isValid}>
            Save
          </Button>
        </div>
      </form>
    </>
  );
};
