import { FormProvider, useForm } from 'react-hook-form';

import InputArea from '@/components/common/InputArea';

import { ResidentContent } from '@/lib/mockApp/types';


export type ResidentDetailParams = {
  input: ResidentContent
}

const ResidentDetail = ({ input }: ResidentDetailParams) => {

  const methods = useForm<ResidentContent>({
    defaultValues: {
      fullName: input.fullName,
      fullNameFurigana: input.fullNameFurigana,
      address: input.address,
      addressRegistDate: input.addressRegistDate,
      permanentAddress: input.permanentAddress,
    },
  });

  return (
    <>
      <FormProvider {...methods} >
        <section>
          <InputArea<ResidentContent> label={"氏名"} name={"fullName"} isEnabled={false} />
          <InputArea<ResidentContent> label={"氏名フリガナ"} name={"fullNameFurigana"} isEnabled={false} />
          <InputArea<ResidentContent> label={"住所"} name={"address"} isEnabled={false} />
          <InputArea<ResidentContent> label='住民となった年月' name='addressRegistDate' placeholder='' isEnabled={false} />
          <InputArea<ResidentContent> label='本籍地' name="permanentAddress" placeholder='' isEnabled={false} />
        </section>
      </FormProvider>
    </>
  );
};

export default ResidentDetail;
