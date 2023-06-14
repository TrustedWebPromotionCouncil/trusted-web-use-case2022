import { FormProvider } from 'react-hook-form';

import Container from '@/components/common/Container';
import Header from '@/components/common/Header';
import InputArea from '@/components/common/InputArea';
import TransitionButton from '@/components/common/TransitionButton';
import TransitionArea from '@/components/common/TransitionArea';
import Progress from '@/components/common/Progress';
import VCSelect from '@/components/common/VCSelect';

import Loading from '../common/Loading';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useRecoilState, useRecoilValue } from 'recoil';
import useVCHandler from '@/lib/mockApp/hooks/useVCHandler';
import { isResidentContent } from '@/lib/mockApp/utils/typeGuard';

import { SubsidyContent, ResidentContent } from '@/lib/mockApp/types';
import {
  subsidyInput2State,
  residentVCList2State,
  accountVCList2State,
  taxVCList2State,
} from '@/lib/mockApp/states';
import { urls, SubsidyInputDefault } from '@/lib/mockApp/consts';

const SubsidyInputMain = () => {
  const router = useRouter();
  const vcHandler = useVCHandler();

  const [input, setInput] = useRecoilState(subsidyInput2State);
  const residentVCList = useRecoilValue(residentVCList2State);
  const accountVCList = useRecoilValue(accountVCList2State);
  const taxVCList = useRecoilValue(taxVCList2State);

  const [residentVC, setResidentVC] = useState<ResidentContent>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [accountList, setAccountList] = useState<boolean[]>([]);
  const [taxList, setTaxList] = useState<boolean[]>([]);

  const methods = useForm<SubsidyContent>({
    defaultValues:
      input && residentVC
        ? {
            ...input,
            fullName: residentVC.fullName,
            address: residentVC.address,
          }
        : input
        ? { ...input }
        : SubsidyInputDefault,
  });

  useEffect(() => {
    (async () => {
      setIsLoading(() => true);
      if (residentVCList && residentVCList.length > 0) {
        const index = residentVCList.length - 1;
        const verifiedVC = await vcHandler.verifyVC(residentVCList[index].jwt);
        if (
          verifiedVC &&
          verifiedVC.revoked &&
          isResidentContent(verifiedVC.verifiedJWT.payload.vc.credentialSubject)
        ) {
          setResidentVC(verifiedVC.verifiedJWT.payload.vc.credentialSubject);
          methods.setValue(
            'fullName',
            verifiedVC.verifiedJWT.payload.vc.credentialSubject.fullName
          );
          methods.setValue(
            'address',
            verifiedVC.verifiedJWT.payload.vc.credentialSubject.address
          );

          methods.setValue('residentVC', index.toString());
          setInput((prev) =>
            prev
              ? { ...prev, residentVC: index.toString() }
              : { ...SubsidyInputDefault, residentVC: index.toString() }
          );
        }
      }
      if (accountVCList) {
        const revokeList = await Promise.all(
          accountVCList.map(async (item, index) => {
            const verifiedVC = await vcHandler.verifyVC(item.jwt);
            if (verifiedVC && verifiedVC.revoked) {
              methods.setValue('accountVC', index.toString());
              setInput((prev) =>
                prev
                  ? { ...prev, accountVC: index.toString() }
                  : { ...SubsidyInputDefault, accountVC: index.toString() }
              );
            }
            return verifiedVC ? verifiedVC.revoked : false;
          })
        );
        setAccountList(revokeList);
      }
      if (taxVCList) {
        const revokeList = await Promise.all(
          taxVCList.map(async (item, index) => {
            const verifiedVC = await vcHandler.verifyVC(item.jwt);
            if (verifiedVC && verifiedVC.revoked) {
              methods.setValue('taxVC', index.toString());
              setInput((prev) =>
                prev
                  ? { ...prev, taxVC: index.toString() }
                  : { ...SubsidyInputDefault, taxVC: index.toString() }
              );
            }
            return verifiedVC ? verifiedVC.revoked : false;
          })
        );
        setTaxList(revokeList);
      }
      setIsLoading(() => false);
    })();
  }, [residentVCList, methods, accountVCList, setInput, taxVCList]);

  const onSubmit = methods.handleSubmit((data: SubsidyContent) => {
    const resident = data.residentVC ? data.residentVC : '-1';
    const account = data.accountVC ? data.accountVC : '-1';
    const tax = data.taxVC ? data.taxVC : '-1';

    setInput(() => ({
      ...{
        ...{
          residentVC: resident,
          accountVC: account,
          taxVC: tax,
          fullName: data.fullName,
          address: data.address,
          vp: '',
        },
      },
    }));

    router.push(urls.subsidyConfirm);
  });

  return (
    <>
      <Header />
      <main>
        <Progress status={'input'} />
        <Loading isLoading={isLoading}>
          {!residentVC ? (
            <div className={'relative w-full text-center'}>
              <span
                className={
                  'absolute w-full left-0 -top-5 text-sm text-color-warnig'
                }
              >
                住民票紐付申請を実施してください。
              </span>
            </div>
          ) : null}
          <FormProvider {...methods}>
            <form onSubmit={onSubmit}>
              <Container>
                <Container title={'申請書類の選択'} isRequred={true}>
                  <ul className={'mt-7 ml-3'}>
                    <li className={'py-3 pl-4 pr-6 w-78 flex'}>
                      <div
                        className={
                          'relative w-[281px] h-[44px] px-2 border border-color-gray rounded-lg text-base'
                        }
                      >
                        {residentVC &&
                        residentVCList &&
                        residentVCList[residentVCList.length - 1] ? (
                          <label
                            className={
                              'absolute left-0 top-1/2 translate-x-2 -translate-y-1/2'
                            }
                          >
                            住民票 - VC{residentVCList.length}
                          </label>
                        ) : (
                          <label
                            className={
                              'absolute left-0 top-1/2 translate-x-2 -translate-y-1/2'
                            }
                          >
                            住民票 - VC0
                          </label>
                        )}
                        <svg
                          className={
                            'hidden absolute right-0 top-1/2 -translate-x-2 -translate-y-1/2'
                          }
                          width="21"
                          height="10"
                          viewBox="0 0 21 10"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M21 0L0.000143051 0L10.5001 10L21 0Z"
                            fill="#00938A"
                          />
                        </svg>
                        <img
                          src="/authenticated.svg"
                          className={'absolute top-0 right-0 -translate-x-1/2'}
                        />
                      </div>
                    </li>
                    <li className={'py-3 pl-4 pr-6 w-78 flex'}>
                      <VCSelect<SubsidyContent>
                        label={'口座実在証明書'}
                        name={'accountVC'}
                        items={accountList}
                        currentVal={input ? input.accountVC : undefined}
                      />
                    </li>
                    <li className={'py-3 pl-4 pr-6 w-78 flex'}>
                      <VCSelect<SubsidyContent>
                        label={'納税証明書'}
                        name={'taxVC'}
                        items={taxList}
                        currentVal={input ? input.taxVC : undefined}
                      />
                    </li>
                  </ul>
                </Container>
                <Container title={'申請者情報'}>
                  <div className={'mt-7 ml-3'}>
                    <InputArea<SubsidyContent>
                      label="申請者名"
                      name="fullName"
                      placeholder=""
                      isEnabled={!residentVC}
                    />
                    <InputArea<SubsidyContent>
                      label="申請者住所"
                      name="address"
                      placeholder=""
                      isEnabled={!residentVC}
                    />
                  </div>
                </Container>
                <TransitionArea>
                  <TransitionButton
                    text="確認"
                    type={'next'}
                    currentUser={'applicant'}
                  />
                </TransitionArea>
              </Container>
            </form>
          </FormProvider>
        </Loading>
      </main>
    </>
  );
};

export default SubsidyInputMain;
