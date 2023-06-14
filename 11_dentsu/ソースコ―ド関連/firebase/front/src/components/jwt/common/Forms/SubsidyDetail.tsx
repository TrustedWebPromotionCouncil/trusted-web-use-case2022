import { FormProvider, useForm } from 'react-hook-form';

import InputArea from '@/components/common/InputArea';

import Container from '@/components/common/Container';
import { SubsidyContent, verifyVPResultType } from '@/lib/mockApp/types';

export type SubsidyDetailParams = {
  input: SubsidyContent;
  verifyResult?: verifyVPResultType;
};

const SubsidyDetail = ({ input, verifyResult }: SubsidyDetailParams) => {
  const methods = useForm<SubsidyContent>({
    defaultValues: {
      residentVC: input.residentVC,
      accountVC: input.accountVC,
      taxVC: input.taxVC,
      fullName: input.fullName,
      address: input.address,
    },
  });

  return (
    <>
      <FormProvider {...methods}>
        <Container title={'申請書類の選択'}>
          <ul className={'mt-7 ml-3'}>
            <li className={'py-3 pl-4 pr-6 w-78 flex relative'}>
              <input
                type="text"
                className={
                  'w-[281px] h-[44px] px-2 rounded-lg text-base bg-color-disabled'
                }
                disabled={true}
                value={`住民票 - VC${parseInt(input.residentVC) + 1}`}
              />
              {verifyResult ? (
                verifyResult.residentVerifyStatus ? (
                  <img
                    src="/authenticated.svg"
                    className={
                      'absolute top-0 right-0 -translate-x-1/2 translate-y-2'
                    }
                  />
                ) : (
                  <img
                    src="/warning.svg"
                    className={
                      'absolute top-0 right-0 -translate-x-full translate-y-full pr-2'
                    }
                  />
                )
              ) : null}
            </li>
            <li className={'py-3 pl-4 pr-6 w-78 flex relative'}>
              <input
                type="text"
                className={
                  'w-[281px] h-[44px] px-2 rounded-lg text-base bg-color-disabled'
                }
                disabled={true}
                value={`口座実在証明証 - VC${parseInt(input.accountVC) + 1}`}
              />
              {verifyResult ? (
                verifyResult.accountVerifyStatus ? (
                  <img
                    src="/authenticated.svg"
                    className={
                      'absolute top-0 right-0 -translate-x-1/2 translate-y-2'
                    }
                  />
                ) : (
                  <img
                    src="/warning.svg"
                    className={
                      'absolute top-0 right-0 -translate-x-full translate-y-full pr-2'
                    }
                  />
                )
              ) : null}
            </li>
            <li className={'py-3 pl-4 pr-6 w-78 flex relative'}>
              <input
                type="text"
                className={
                  'w-[281px] h-[44px] px-2 rounded-lg text-base bg-color-disabled'
                }
                disabled={true}
                value={`納税証明書 - VC${parseInt(input.taxVC) + 1}`}
              />
              {verifyResult ? (
                verifyResult.taxVerifyStatus ? (
                  <img
                    src="/authenticated.svg"
                    className={
                      'absolute top-0 right-0 -translate-x-1/2 translate-y-2'
                    }
                  />
                ) : (
                  <img
                    src="/warning.svg"
                    className={
                      'absolute top-0 right-0 -translate-x-full translate-y-full pr-2'
                    }
                  />
                )
              ) : null}
            </li>
          </ul>
        </Container>
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
      </FormProvider>
    </>
  );
};

export default SubsidyDetail;
