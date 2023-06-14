import { useRouter } from 'next/router';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useErrorHandler } from 'react-error-boundary';

import {
  residentInput2State,
  residentReqList2State,
} from '@/lib/mockApp/states';
import { VCReqListItem } from '@/lib/mockApp/types';

import Progress from '@/components/common/Progress';
import Header from '@/components/common/Header';
import useVCHandler from '@/lib/mockApp/hooks/useVCHandler';
import { generateID } from '@/lib/mockApp/utils';
import { urls } from '@/lib/mockApp/consts';

const ResidentConfirmMain = () => {
  const router = useRouter();
  const errorHandler = useErrorHandler();
  const vcHandler = useVCHandler();

  const input = useRecoilValue(residentInput2State);
  const setReqList = useSetRecoilState(residentReqList2State);

  const onSubmit = async () => {
    try {
      if (input) {
        const jwt = await vcHandler.createVCRequest(input);
        if (jwt) {
          const listItem: VCReqListItem = { id: generateID('resident'), jwt };
          setReqList((prev) => (prev ? [...prev, listItem] : [listItem]));
        }
        router.push(urls.residentDone);
      }
    } catch (e) {
      errorHandler(e);
    }
  };

  return (
    <>
      <Header />
      <main className="bg-color-background">
        <Progress status="confirm" />
        {input ? (
          <div className="mt-[9px] py-0 px-[53px]">
            <div className="input-form-label">氏名</div>
            <input
              type="text"
              disabled={true}
              value={input.fullName}
              className="input-form-text-box-confirm"
            />
            <div className="input-form-label">氏名フリガナ</div>
            <input
              type="text"
              disabled={true}
              value={input.fullNameFurigana}
              className="input-form-text-box-confirm"
            />
            <div className="input-form-label">住所</div>
            <input
              type="text"
              disabled={true}
              value={input.address}
              className="input-form-text-box-confirm"
            />
            <div className="input-form-label">住民となった年月</div>
            <input
              type="text"
              disabled={true}
              value={input.addressRegistDate}
              className="input-form-text-box-confirm"
            />
            <div className="input-form-label">本籍地</div>
            <input
              type="text"
              disabled={true}
              value={input.permanentAddress}
              className="input-form-text-box-confirm"
            />
            <div className="pt-4 flex justify-between">
              <button
                onClick={() => router.back()}
                className="input-form-button-gray"
              >
                戻る
              </button>
              <button onClick={onSubmit} className="input-form-button-green">
                申請
              </button>
            </div>
          </div>
        ) : undefined}
      </main>
    </>
  );
};

export default ResidentConfirmMain;
