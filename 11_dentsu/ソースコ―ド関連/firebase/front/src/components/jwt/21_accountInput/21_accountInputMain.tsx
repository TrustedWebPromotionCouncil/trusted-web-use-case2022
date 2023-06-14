import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useRecoilState, useRecoilValue } from 'recoil';

import { AccountContent, ResidentContent } from '@/lib/mockApp/types';
import { accountInput2State, residentVCList2State } from '@/lib/mockApp/states';
import { urls, AccountInputDefault } from '@/lib/mockApp/consts';

import Header from '@/components/common/Header';
import Progress from '@/components/common/Progress';
import Loading from '../common/Loading';
import useVCHandler from '@/lib/mockApp/hooks/useVCHandler';
import { isResidentContent } from '@/lib/mockApp/utils/typeGuard';

const AccountInputMain = () => {
  const router = useRouter();
  const vcHandler = useVCHandler();

  const [input, setInput] = useRecoilState(accountInput2State);

  const residentVCList = useRecoilValue(residentVCList2State);
  const [residentVC, setResidentVC] = useState<ResidentContent>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AccountContent>({
    defaultValues:
      input && residentVC
        ? {
            ...input,
            fullName: residentVC.fullName,
            address: residentVC.address,
          }
        : input
        ? { ...input }
        : AccountInputDefault,
  });

  useEffect(() => {
    (async () => {
      setIsLoading(() => true);

      if (residentVCList && residentVCList.length > 0) {
        const idx = residentVCList.length - 1;
        const verifiedVC = await vcHandler.verifyVC(residentVCList[idx].jwt);
        if (
          verifiedVC &&
          isResidentContent(verifiedVC.verifiedJWT.payload.vc.credentialSubject)
        ) {
          verifiedVC.revoked &&
            setResidentVC(verifiedVC.verifiedJWT.payload.vc.credentialSubject);
          setValue(
            'fullName',
            verifiedVC.verifiedJWT.payload.vc.credentialSubject.fullName
          );
          setValue(
            'address',
            verifiedVC.verifiedJWT.payload.vc.credentialSubject.address
          );
        }
      }
      setIsLoading(() => false);
    })();
  }, [residentVCList, setValue]);

  const onSubmit = handleSubmit((data: AccountContent) => {
    setInput(() => ({
      ...{
        bankCode: data.bankCode,
        branchNumber: data.branchNumber,
        accountNumber: data.accountNumber,
        corporateName: data.corporateName,
        fullName: data.fullName,
        address: data.address,
      },
    }));

    router.push(urls.accountConfirm);
  });

  return (
    <>
      <Header />
      <main className="bg-color-background">
        <Progress status="input" />
        <Loading isLoading={isLoading}>
          {!residentVC ? (
            <div className={'relative w-full text-center'}>
              <span
                className={
                  'absolute w-full left-0 -top-8 text-sm text-color-warnig'
                }
              >
                住民票紐付申請を実施してください。
              </span>
            </div>
          ) : null}
          <div className="mt-[9px] py-0 px-[53px]">
            <form onSubmit={onSubmit}>
              <div className="input-form-label">
                金融機関コード
                <span className="input-form-label-required">（必須）</span>
                <span className="text-error-message text-color-required">
                  {errors.bankCode && '・' + errors.bankCode.message}
                </span>
              </div>
              <input
                type="text"
                maxLength={4}
                className="input-form-text-box-half"
                {...register('bankCode', {
                  pattern: {
                    value: /\d{4}/,
                    message: '半角数字で4桁です',
                  },
                })}
              />
              <div className="input-form-label">
                支店番号
                <span className="input-form-label-required">（必須）</span>
                <span className="text-error-message text-color-required">
                  {errors.branchNumber && '・' + errors.branchNumber.message}
                </span>
              </div>
              <input
                type="text"
                maxLength={3}
                className="input-form-text-box-half"
                {...register('branchNumber', {
                  pattern: {
                    value: /\d{3}/,
                    message: '半角数字で3桁です',
                  },
                })}
              />
              <div className="input-form-label">
                口座番号
                <span className="input-form-label-required">（必須）</span>
                <span className="text-error-message text-color-required">
                  {errors.accountNumber && '・' + errors.accountNumber.message}
                </span>
              </div>
              <input
                type="text"
                maxLength={8}
                className="input-form-text-box-half"
                {...register('accountNumber', {
                  pattern: {
                    value: /\d{7}|\d{8}/,
                    message: '半角数字で7桁または8桁です',
                  },
                })}
              />
              <div className="input-form-label">
                法人名称
                <span className="input-form-label-required">（必須）</span>
                <span className="text-error-message text-color-required">
                  {errors.corporateName && '・' + errors.corporateName.message}
                </span>
              </div>
              <input
                type="text"
                className="input-form-text-box"
                {...register('corporateName')}
              />
              <div className="input-form-label">申請者名</div>
              <input
                type="text"
                className={`${
                  !!residentVC
                    ? 'input-form-text-box-confirm'
                    : 'input-form-text-box'
                }`}
                {...register('fullName')}
                disabled={!!residentVC}
              />
              <div className="input-form-label">申請住所</div>
              <input
                type="text"
                className={`${
                  !!residentVC
                    ? 'input-form-text-box-confirm'
                    : 'input-form-text-box'
                }`}
                {...register('address')}
                disabled={!!residentVC}
              />
              <div className="pt-4 text-right">
                <button type="submit" className="input-form-button-green">
                  確認
                </button>
              </div>
            </form>
          </div>
        </Loading>
      </main>
    </>
  );
};

export default AccountInputMain;
