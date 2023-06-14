import { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useRecoilState } from 'recoil';

import { ResidentContent } from '@/lib/mockApp/types';
import { years, months } from '@/lib/mockApp/utils/dateUtils';
import { residentInput2State } from '@/lib/mockApp/states';
import { urls, ResidentInputDefault } from '@/lib/mockApp/consts';

import Header from '@/components/common/Header';
import Progress from '@/components/common/Progress';

const ResidentInputMain = () => {
  const router = useRouter();
  const [input, setInput] = useRecoilState(residentInput2State);
  const [addressRegistYear, setAddressRegistYear] = useState(
    input ? input.addressRegistYear : ''
  );
  const [addressRegistMonth, setAddressRegistMonth] = useState(
    input ? input.addressRegistMonth : ''
  );
  const selectAddressRegistYear = (e: any) => {
    setAddressRegistYear(e.target.value);
  };
  const selectAddressRegistMonth = (e: any) => {
    setAddressRegistMonth(e.target.value);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResidentContent>({
    defaultValues: input ? { ...input } : ResidentInputDefault,
  });

  const onSubmit = handleSubmit((data: ResidentContent) => {
    const year = addressRegistYear
      ? addressRegistYear
      : new Date().getFullYear().toString() + '年';
    const monnth = addressRegistMonth ? addressRegistMonth : '1月';

    setInput(() => ({
      fullName: data.fullName,
      fullNameFurigana: data.fullNameFurigana,
      address: data.address,
      addressRegistDate: year + monnth,
      addressRegistYear: year,
      addressRegistMonth: monnth,
      permanentAddress: data.permanentAddress,
    }));

    router.push(urls.residentConfirm);
  });

  return (
    <>
      <Header />
      <main className="bg-color-background">
        <Progress status="input" />
        <div className="mt-[9px] py-0 px-[53px]">
          <form onSubmit={onSubmit}>
            <div className="input-form-label">
              氏名<span className="input-form-label-required">（必須）</span>
              <span className="text-error-message text-color-required">
                {errors.fullName && '・' + errors.fullName.message}
              </span>
            </div>
            <input
              type="text"
              className="input-form-text-box"
              {...register('fullName')}
            />
            <div className="input-form-label">
              氏名フリガナ
              <span className="input-form-label-required">（必須）</span>
              <span className="text-error-message text-color-required">
                {errors.fullNameFurigana &&
                  '・' + errors.fullNameFurigana.message}
              </span>
            </div>
            <input
              type="text"
              className="input-form-text-box"
              {...register('fullNameFurigana', {
                pattern: {
                  value: /^[ァ-ヴー　]*$/,
                  message: '全角カナで入力してください',
                },
              })}
            />
            <div className="input-form-label">
              住所<span className="input-form-label-required">（必須）</span>
              <span className="text-error-message text-color-required">
                {errors.address && '・' + errors.address.message}
              </span>
            </div>
            <input
              type="text"
              className="input-form-text-box"
              {...register('address')}
            />
            <div className="input-form-label">
              住民となった年月
              <span className="input-form-label-required">（必須）</span>
            </div>
            <select
              value={addressRegistYear}
              className="input-form-select-year"
              onChange={selectAddressRegistYear}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <select
              value={addressRegistMonth}
              className="input-form-select-month"
              onChange={selectAddressRegistMonth}
            >
              {months.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
            <div className="input-form-label">
              本籍地<span className="input-form-label-required">（必須）</span>
              <span className="text-error-message text-color-required">
                {errors.permanentAddress &&
                  '・' + errors.permanentAddress.message}
              </span>
            </div>
            <input
              type="text"
              className="input-form-text-box"
              {...register('permanentAddress')}
            />
            <div className="pt-4 text-right">
              <button type="submit" className="input-form-button-green">
                確認
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
};

export default ResidentInputMain;
