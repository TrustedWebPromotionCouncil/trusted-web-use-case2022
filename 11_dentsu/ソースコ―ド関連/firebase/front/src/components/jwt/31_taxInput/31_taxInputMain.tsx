import { FormProvider } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useRecoilState, useRecoilValue } from 'recoil';

import Container from '@/components/common/Container';
import Header from '@/components/common/Header';
import InputArea from '@/components/common/InputArea';
import TransitionButton from '@/components/common/TransitionButton';
import TransitionArea from '@/components/common/TransitionArea';
import Progress from '@/components/common/Progress';
import Loading from '../common/Loading';
import useVCHandler from '@/lib/mockApp/hooks/useVCHandler';
import { isResidentContent } from '@/lib/mockApp/utils/typeGuard';

import { TaxContent, ResidentContent } from '@/lib/mockApp/types';
import { taxInput2State, residentVCList2State } from '@/lib/mockApp/states';
import { urls, TaxInputDefault } from '@/lib/mockApp/consts';

const TaxInputMain = () => {
  const router = useRouter();
  const vcHandler = useVCHandler();

  const [input, setInput] = useRecoilState(taxInput2State);

  const residentVCList = useRecoilValue(residentVCList2State);
  const [residentVC, setResidentVC] = useState<ResidentContent>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const methods = useForm<TaxContent>({
    defaultValues:
      input && residentVC
        ? {
            ...input,
            fullName: residentVC.fullName,
            address: residentVC.address,
          }
        : input
        ? { ...input }
        : TaxInputDefault,
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
          methods.setValue(
            'fullName',
            verifiedVC.verifiedJWT.payload.vc.credentialSubject.fullName
          );
          methods.setValue(
            'address',
            verifiedVC.verifiedJWT.payload.vc.credentialSubject.address
          );
        }
      }
      setIsLoading(() => false);
    })();
  }, [residentVCList, methods]);

  const onSubmit = methods.handleSubmit((data: TaxContent) => {
    setInput(() => ({
      ...{
        address: data.address,
        applicationYear: data.applicationYear,
        corporationAddress: data.corporationAddress,
        corporationName: data.corporationName,
        fullName: data.fullName,
      },
    }));

    router.push(urls.taxConfirm);
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
          {!isLoading && (
            <FormProvider {...methods}>
              <form onSubmit={onSubmit}>
                <Container>
                  <InputArea<TaxContent>
                    label={'申請年度'}
                    name={'applicationYear'}
                    placeholder={'2023'}
                    validation={{ pattern: /[0-9]{4}/ }}
                    isRequired={true}
                  />
                  <InputArea<TaxContent>
                    label={'法人名称'}
                    name={'corporationName'}
                    isRequired={true}
                  />
                  <InputArea<TaxContent>
                    label={'所在地'}
                    name={'corporationAddress'}
                    isRequired={true}
                  />
                  <InputArea<TaxContent>
                    label="申請者名"
                    name="fullName"
                    placeholder=""
                    isEnabled={!residentVC}
                  />
                  <InputArea<TaxContent>
                    label="申請者住所"
                    name="address"
                    placeholder=""
                    isEnabled={!residentVC}
                  />
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
          )}
        </Loading>
      </main>
    </>
  );
};

export default TaxInputMain;
