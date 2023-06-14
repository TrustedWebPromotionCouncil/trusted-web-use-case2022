import { FormProvider } from 'react-hook-form';
import { useRouter } from 'next/router';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useErrorHandler } from 'react-error-boundary';
import { useForm } from 'react-hook-form';

import { taxInput2State, taxReqList2State } from '@/lib/mockApp/states';
import { VCReqListItem } from '@/lib/mockApp/types';
import { TaxContent } from '@/lib/mockApp/types';
import useVCHandler from '@/lib/mockApp/hooks/useVCHandler';
import { generateID } from '@/lib/mockApp/utils';
import { urls } from '@/lib/mockApp/consts';

import Progress from '@/components/common/Progress';
import Header from '@/components/common/Header';
import Container from '@/components/common/Container';
import InputArea from '@/components/common/InputArea';
import TransitionButton from '@/components/common/TransitionButton';
import TransitionArea from '@/components/common/TransitionArea';

const TaxConfirmMain = () => {
  const router = useRouter();
  const errorHandler = useErrorHandler();
  const vcHandler = useVCHandler();

  const input = useRecoilValue(taxInput2State);
  const setReqList = useSetRecoilState(taxReqList2State);

  const methods = useForm<TaxContent>({
    defaultValues: input,
  });

  const onSubmit = async () => {
    try {
      if (input) {
        const jwt = await vcHandler.createVCRequest(input);
        if (jwt) {
          const listItem: VCReqListItem = { id: generateID('tax'), jwt };
          setReqList((prev) => (prev ? [...prev, listItem] : [listItem]));
        }
        router.push(urls.taxDone);
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
            <InputArea<TaxContent>
              label={'申請年度'}
              name={'applicationYear'}
              isEnabled={false}
            />
            <InputArea<TaxContent>
              label={'法人名称'}
              name={'corporationName'}
              isEnabled={false}
            />
            <InputArea<TaxContent>
              label={'所在地'}
              name={'corporationAddress'}
              isEnabled={false}
            />
            <InputArea<TaxContent>
              label="申請者名"
              name="fullName"
              placeholder=""
              isEnabled={false}
            />
            <InputArea<TaxContent>
              label="申請者住所"
              name="address"
              placeholder=""
              isEnabled={false}
            />
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

export default TaxConfirmMain;
