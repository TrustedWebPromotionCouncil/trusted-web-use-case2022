import { FormProvider, useForm } from 'react-hook-form';

import InputArea from '@/components/common/InputArea';
import { TaxContent } from '@/lib/mockApp/types';

export type TaxDetailParams = {
  input: TaxContent;
};

const TaxDetail = ({ input }: TaxDetailParams) => {
  const methods = useForm<TaxContent>({
    defaultValues: {
      applicationYear: input.applicationYear,
      corporationName: input.corporationName,
      corporationAddress: input.corporationAddress,
      fullName: input.fullName,
      address: input.address,
    },
  });

  return (
    <>
      <FormProvider {...methods}>
        <section>
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
        </section>
      </FormProvider>
    </>
  );
};

export default TaxDetail;
