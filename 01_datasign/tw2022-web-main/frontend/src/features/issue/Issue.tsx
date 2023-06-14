import React, { FunctionComponent, useCallback } from 'react';
import { getIn, useFormik } from 'formik';
import * as yup from 'yup';
import _ from 'lodash';

import './Issue.scss';
import { Header, InputText, Button, InputCheck } from '../../shered/components';
import issueAsyncProcess from './issueAsyncProcess';

const FormSchema = yup.object().shape({
  url: yup.string().url().required('URLを入力してください'),
  name: yup.string().required('会社名を入力してください'),
  postalCode: yup.string().required('郵便番号を入力してください'),
  addressCountry: yup.string().required('国名を入力してください'),
  addressRegion: yup.string().required('都道府県を入力してください'),
  addressLocality: yup.string().required('市区町村を入力してください'),
  streetAddress: yup.string().required('番地号・建物名を入力してください'),
  businessCategory: yup.string().required('事業形態にチェック入れてください'),
  expire: yup.number().required('有効期限を入力してください(初期値365日)'),
});
interface CompanyInfoValues {
  label: string;
  formikRef: string;
  placeholder: string;
}
export interface CompanyInfoProps {
  url: CompanyInfoValues;
  name: CompanyInfoValues;
  postalCode: CompanyInfoValues;
  addressCountry: CompanyInfoValues;
  addressRegion: CompanyInfoValues;
  addressLocality: CompanyInfoValues;
  streetAddress: CompanyInfoValues;
  [key: string]: CompanyInfoValues;
}
export const CompanyInfoState: CompanyInfoProps = {
  url: { label: 'URL', formikRef: 'url', placeholder: 'https://datasign.com' },
  name: { label: '企業名', formikRef: 'name', placeholder: 'XXX Inc' },
  postalCode: { label: '郵便番号', formikRef: 'postalCode', placeholder: '000-0000' },
  addressCountry: { label: '国名', formikRef: 'addressCountry', placeholder: 'JP' },
  addressRegion: { label: '都道府県', formikRef: 'addressRegion', placeholder: 'Tokyo' },
  addressLocality: { label: '市区町村', formikRef: 'addressLocality', placeholder: 'Shibuya' },
  streetAddress: { label: '番地', formikRef: 'streetAddress', placeholder: '0-0-0' },
};
export const ExpireState = {
  expire: { label: '有効期限', formikRef: 'expire', placeholder: '365' },
};
export const Issue: FunctionComponent = () => {
  const [apiResultSuccess, setApiResultSuccess] = React.useState<boolean>(true);
  const formik = useFormik({
    initialValues: {
      url: '',
      name: '',
      postalCode: '',
      addressCountry: '',
      addressRegion: '',
      addressLocality: '',
      streetAddress: '',
      businessCategory: '',
      expire: '365',
    },
    validationSchema: FormSchema,
    enableReinitialize: true,

    onSubmit: async (values, { resetForm }) => {
      if (await issueAsyncProcess(values)) {
        resetForm();
      } else {
        setApiResultSuccess(false);
        console.error('api error');
      }
    },
  });
  const handleSubmit = useCallback(_.throttle(formik.handleSubmit, 3000, { trailing: false }), []);
  return (
    <>
      <Header title="Originator Profile登録" />
      <form className="form" onSubmit={handleSubmit}>
        <div className="companyInfo">
          <h5>基本情報</h5>
          <table>
            <tbody>
              {Object.keys(CompanyInfoState).map((key) => {
                return (
                  <tr key={key}>
                    <th>
                      <label>{CompanyInfoState[key].label}</label>
                    </th>
                    <td>
                      <div key={key}>
                        <InputText
                          placeholder={CompanyInfoState[key].placeholder}
                          type="input"
                          /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */
                          value={getIn(formik.values, CompanyInfoState[key].formikRef)}
                          /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */
                          error={getIn(formik.errors, CompanyInfoState[key].formikRef)}
                          onChange={formik.handleChange(key)}
                          data-testid={key}
                          className={key}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="businessCategory">
          <h5>カテゴリー</h5>
          <table>
            <thead>
              <tr>
                <th>
                  <label>認証事業領域</label>
                </th>
                <th>
                  <label>事業形態</label>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>
                  <label>①広告購⼊者</label>
                </th>
                <td>
                  <InputCheck
                    id="adCompany"
                    name="businessCategory"
                    type="radio"
                    label={'広告会社'}
                    value="adCompany"
                    error={formik.errors.businessCategory}
                    onChange={formik.handleChange('businessCategory')}
                  />
                  <InputCheck
                    id="advertiser"
                    name="businessCategory"
                    type="radio"
                    label={'広告主'}
                    value="advertiser"
                    error={formik.errors.businessCategory}
                    onChange={formik.handleChange('businessCategory')}
                  />
                </td>
              </tr>
              <tr>
                <th>
                  <label>②広告取引仲介事業者</label>
                </th>
                <td>
                  <InputCheck
                    id="dsp"
                    name="businessCategory"
                    type="radio"
                    label={'DSP事業者'}
                    value="dsp"
                    error={formik.errors.businessCategory}
                    onChange={formik.handleChange('businessCategory')}
                  />
                  <InputCheck
                    id="ssp"
                    name="businessCategory"
                    type="radio"
                    label={'SSP事業者'}
                    value="ssp"
                    error={formik.errors.businessCategory}
                    onChange={formik.handleChange('businessCategory')}
                  />
                  <InputCheck
                    id="adNetwork"
                    name="businessCategory"
                    type="radio"
                    label={'アドネットワーク事業者'}
                    value="adNetwork"
                    error={formik.errors.businessCategory}
                    onChange={formik.handleChange('businessCategory')}
                  />
                  <InputCheck
                    id="adExchange"
                    name="businessCategory"
                    type="radio"
                    label={'アドエクスチェンジ事業者'}
                    value="adExchange"
                    error={formik.errors.businessCategory}
                    onChange={formik.handleChange('businessCategory')}
                  />
                </td>
              </tr>
              <tr>
                <th>
                  <label>③広告販売者</label>
                </th>
                <td>
                  <InputCheck
                    id="media"
                    name="businessCategory"
                    type="radio"
                    label={'媒体事業者'}
                    value="media"
                    error={formik.errors.businessCategory}
                    onChange={formik.handleChange('businessCategory')}
                  />
                </td>
              </tr>
              <tr>
                <th>
                  <label>④広告計測事業者</label>
                </th>
                <td>
                  <InputCheck
                    id="adVerification"
                    name="businessCategory"
                    type="radio"
                    label={'アドベリツールベンダー'}
                    value="adVerification"
                    error={formik.errors.businessCategory}
                    onChange={formik.handleChange('businessCategory')}
                  />
                </td>
              </tr>
              <tr>
                <th>
                  <label>⑤アクセス解析</label>
                </th>
                <td>
                  <InputCheck
                    id="analytics"
                    name="businessCategory"
                    type="radio"
                    label={'アクセス解析事業者'}
                    value="analytics"
                    error={formik.errors.businessCategory}
                    onChange={formik.handleChange('businessCategory')}
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <div className="error-container">
            {formik.errors.businessCategory != null && (
              <label className="error-text">{formik.errors.businessCategory}</label>
            )}
          </div>
        </div>
        <h5>有効期限</h5>
        <div className="expire">
          <InputText
            label={ExpireState.expire.label}
            placeholder={ExpireState.expire.placeholder}
            type="input"
            value={formik.values.expire}
            error={formik.errors.expire}
            onChange={formik.handleChange('expire')}
            data-testid={'expire'}
            className={'expire'}
          />
        </div>
        <div className="error-container">
          {!apiResultSuccess && (
            <label className="error-text">
              Apiエラー
              <br />
              Apiのログを確認してください。
            </label>
          )}
        </div>
        <div className="bottom-container">
          <Button type="submit" disabled={!formik.dirty || !formik.isValid} data-testid="register">
            OP登録
          </Button>
        </div>
      </form>
    </>
  );
};
export default Issue;
