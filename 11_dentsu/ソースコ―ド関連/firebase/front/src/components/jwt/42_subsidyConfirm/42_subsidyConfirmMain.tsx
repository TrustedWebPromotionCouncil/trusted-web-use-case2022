import { FormProvider } from 'react-hook-form';
import { useRouter } from 'next/router';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useErrorHandler } from 'react-error-boundary';
import { useForm } from 'react-hook-form';

import { subsidyInput2State, subsidyReqList2State } from '@/lib/mockApp/states';
import { VCReqListItem } from '@/lib/mockApp/types';
import { SubsidyContent } from '@/lib/mockApp/types';
import useVCHandler from '@/lib/mockApp/hooks/useVCHandler';
import { generateID } from '@/lib/mockApp/utils';
import { urls } from '@/lib/mockApp/consts';

import Progress from '@/components/common/Progress';
import Header from '@/components/common/Header';
import Container from '@/components/common/Container';
import InputArea from '@/components/common/InputArea';
import TransitionButton from '@/components/common/TransitionButton';
import TransitionArea from '@/components/common/TransitionArea';

const SubsidyConfirmMain = () => {
  const router = useRouter();
  const errorHandler = useErrorHandler();
  const vcHandler = useVCHandler();

  const input = useRecoilValue(subsidyInput2State);
  const setReqList = useSetRecoilState(subsidyReqList2State);

  const methods = useForm<SubsidyContent>({
    defaultValues: input,
  });

  const onSubmit = async () => {
    try {
      if (input) {
        const jwt = await vcHandler.createVCRequest(input);
        if (jwt) {
          const listItem: VCReqListItem = { id: generateID('subsidy'), jwt };
          setReqList((prev) => (prev ? [...prev, listItem] : [listItem]));
        }
        router.push(urls.subsidyDone);
      }
    } catch (e) {
      errorHandler(e);
    }
  };

  return (
    <>
      <Header />
      <main>
        <Progress status={'confirm'} />
        <FormProvider {...methods}>
          <Container>
            {input ? (
              <Container title={'申請書類の選択'}>
                <ul className={'mt-7 ml-3'}>
                  <li className={'relative py-3 pl-4 pr-6 w-78 flex'}>
                    <input
                      type="text"
                      className={
                        'w-[281px] h-[44px] px-2 rounded-lg text-base bg-color-disabled'
                      }
                      disabled={true}
                      value={`住民票 - VC${parseInt(input.residentVC) + 1}`}
                    />

                    <img
                      src="/authenticated.svg"
                      className={
                        'absolute top-0 right-0 -translate-x-1/2 translate-y-3'
                      }
                    />
                  </li>
                  <li className={'relative py-3 pl-4 pr-6 w-78 flex'}>
                    <input
                      type="text"
                      className={
                        'w-[281px] h-[44px] px-2 rounded-lg text-base bg-color-disabled'
                      }
                      disabled={true}
                      value={`口座実在証明証 - VC${
                        parseInt(input.accountVC) + 1
                      }`}
                    />

                    <img
                      src="/authenticated.svg"
                      className={
                        'absolute top-0 right-0 -translate-x-1/2 translate-y-3'
                      }
                    />
                  </li>
                  <li className={'relative py-3 pl-4 pr-6 w-78 flex'}>
                    <input
                      type="text"
                      className={
                        'w-[281px] h-[44px] px-2 rounded-lg text-base bg-color-disabled'
                      }
                      disabled={true}
                      value={`納税証明書 - VC${parseInt(input.taxVC) + 1}`}
                    />

                    <img
                      src="/authenticated.svg"
                      className={
                        'absolute top-0 right-0 -translate-x-1/2 translate-y-3'
                      }
                    />
                  </li>
                </ul>
              </Container>
            ) : null}
            <Container title={'申請者情報'}>
              <div className={'mt-7 ml-3'}>
                <InputArea<SubsidyContent>
                  label="申請者名"
                  name="fullName"
                  placeholder=""
                  isEnabled={false}
                />
                <InputArea<SubsidyContent>
                  label="申請者住所"
                  name="address"
                  placeholder=""
                  isEnabled={false}
                />
              </div>
            </Container>
            <TransitionArea>
              <TransitionButton
                text="戻る"
                type={'prev'}
                currentUser={'applicant'}
                onClick={() => router.back()}
              />
              <TransitionButton
                text="申請"
                type={'next'}
                currentUser={'applicant'}
                onClick={onSubmit}
              />
            </TransitionArea>
          </Container>
        </FormProvider>
      </main>
    </>
  );
};

export default SubsidyConfirmMain;
