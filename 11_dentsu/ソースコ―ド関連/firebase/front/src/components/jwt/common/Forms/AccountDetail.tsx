import { FormProvider, useForm } from 'react-hook-form';

import InputArea from '@/components/common/InputArea';

import { AccountContent } from '@/lib/mockApp/types';

export type AccountDetailParams = {
  input: AccountContent;
};

const AccountDetail = ({ input }: AccountDetailParams) => {
  const methods = useForm<AccountContent>({
    defaultValues: {
      bankCode: input.bankCode,
      branchNumber: input.branchNumber,
      accountNumber: input.accountNumber,
      corporateName: input.corporateName,
      fullName: input.fullName,
      address: input.address,
    },
  });

  return (
    <>
      <FormProvider {...methods}>
        <section>
          <InputArea<AccountContent>
            label={'金融機関コード'}
            name={'bankCode'}
            isEnabled={false}
            size={'small'}
          />
          <InputArea<AccountContent>
            label={'支店番号'}
            name={'branchNumber'}
            isEnabled={false}
            size={'small'}
          />
          <InputArea<AccountContent>
            label={'口座番号'}
            name={'accountNumber'}
            isEnabled={false}
          />
          <InputArea<AccountContent>
            label={'法人名称'}
            name={'corporateName'}
            placeholder=""
            isEnabled={false}
          />
          <InputArea<AccountContent>
            label={'申請者名'}
            name={'fullName'}
            placeholder=""
            isEnabled={false}
          />
          <InputArea<AccountContent>
            label={'申請住所'}
            name={'address'}
            placeholder=""
            isEnabled={false}
          />
        </section>
      </FormProvider>
    </>
  );
};

export default AccountDetail;
