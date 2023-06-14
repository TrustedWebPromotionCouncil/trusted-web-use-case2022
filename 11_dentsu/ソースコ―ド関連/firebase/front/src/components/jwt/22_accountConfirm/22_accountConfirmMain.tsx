import { useRouter } from 'next/router';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useErrorHandler } from 'react-error-boundary';

import { accountInput2State, accountReqList2State } from '@/lib/mockApp/states';
import { VCReqListItem } from '@/lib/mockApp/types';

import Progress from '@/components/common/Progress';
import Header from '@/components/common/Header';
import useVCHandler from '@/lib/mockApp/hooks/useVCHandler';
import { generateID } from '@/lib/mockApp/utils';
import { urls } from '@/lib/mockApp/consts';

const AccountConfirmMain = () => {
  const router = useRouter();
  const errorHandler = useErrorHandler();
  const vcHandler = useVCHandler();

  const input = useRecoilValue(accountInput2State);
  const setReqList = useSetRecoilState(accountReqList2State);

  const onSubmit = async () => {
    try {
      if (input) {
        const jwt = await vcHandler.createVCRequest(input);
        if (jwt) {
          const listItem: VCReqListItem = { id: generateID('account'), jwt };
          setReqList((prev) => (prev ? [...prev, listItem] : [listItem]));
        }
        router.push(urls.accountDone);
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
            <div className="input-form-label">金融機関コード</div>
            <input
              type="text"
              disabled={true}
              value={input.bankCode}
              className="input-form-text-box-confirm-half"
            />
            <div className="input-form-label">支店番号</div>
            <input
              type="text"
              disabled={true}
              value={input.branchNumber}
              className="input-form-text-box-confirm-half"
            />
            <div className="input-form-label">口座番号</div>
            <input
              type="text"
              disabled={true}
              value={input.accountNumber}
              className="input-form-text-box-confirm"
            />
            <div className="input-form-label">法人名称</div>
            <input
              type="text"
              disabled={true}
              value={input.corporateName}
              className="input-form-text-box-confirm"
            />
            <div className="input-form-label">申請者名</div>
            <input
              type="text"
              disabled={true}
              value={input.fullName}
              className="input-form-text-box-confirm"
            />
            <div className="input-form-label">申請住所</div>
            <input
              type="text"
              disabled={true}
              value={input.address}
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

export default AccountConfirmMain;
