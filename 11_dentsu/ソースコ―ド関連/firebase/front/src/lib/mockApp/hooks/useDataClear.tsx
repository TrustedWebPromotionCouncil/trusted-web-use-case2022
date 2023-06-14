import { useSetRecoilState } from 'recoil';

import {
  VCListState,
  accountInputState,
  accountListState,
  accountVCListState,
  accountVCRequestListState,
  dataVerState,
  residentInputState,
  residentListState,
  residentVCListState,
  residentVCRequestListState,
  subsidyInputState,
  subsidyListState,
  subsidyVCListState,
  subsidyVCRequestListState,
  taxInputListState,
  taxInputState,
  taxVCListState,
  taxVCRequestListState,
} from '@/lib/mockApp/states/old';

import {
  accountInput2State,
  accountReqList2State,
  accountVCList2State,
  residentInput2State,
  residentReqList2State,
  residentVCList2State,
  subsidyInput2State,
  subsidyReqList2State,
  subsidyVCList2State,
  taxInput2State,
  taxReqList2State,
  taxVCList2State,
} from '@/lib/mockApp/states';
import { useErrorHandler } from 'react-error-boundary';
import { useState } from 'react';

const useDataClear = () => {
  // before jwt
  const VCList = useSetRecoilState(VCListState);
  const accountInput = useSetRecoilState(accountInputState);
  const accountList = useSetRecoilState(accountListState);
  const accountVCList = useSetRecoilState(accountVCListState);
  const accountVCRequestList = useSetRecoilState(accountVCRequestListState);
  const dataVer = useSetRecoilState(dataVerState);
  const residentInput = useSetRecoilState(residentInputState);
  const residentList = useSetRecoilState(residentListState);
  const residentVCList = useSetRecoilState(residentVCListState);
  const residentVCRequestList = useSetRecoilState(residentVCRequestListState);
  const subsidyInput = useSetRecoilState(subsidyInputState);
  const subsidyList = useSetRecoilState(subsidyListState);
  const subsidyVCList = useSetRecoilState(subsidyVCListState);
  const subsidyVCRequestList = useSetRecoilState(subsidyVCRequestListState);
  const taxInputList = useSetRecoilState(taxInputListState);
  const taxInput = useSetRecoilState(taxInputState);
  const taxVCList = useSetRecoilState(taxVCListState);
  const taxVCRequestList = useSetRecoilState(taxVCRequestListState);

  //   after jwt
  const accountInput2 = useSetRecoilState(accountInput2State);
  const accountReqList2 = useSetRecoilState(accountReqList2State);
  const accountVCList2 = useSetRecoilState(accountVCList2State);
  const residentInput2 = useSetRecoilState(residentInput2State);
  const residentReqList2 = useSetRecoilState(residentReqList2State);
  const residentVCList2 = useSetRecoilState(residentVCList2State);
  const subsidyInput2 = useSetRecoilState(subsidyInput2State);
  const subsidyReqList2 = useSetRecoilState(subsidyReqList2State);
  const subsidyVCList2 = useSetRecoilState(subsidyVCList2State);
  const taxInput2 = useSetRecoilState(taxInput2State);
  const taxReqList2 = useSetRecoilState(taxReqList2State);
  const taxVCList2 = useSetRecoilState(taxVCList2State);

  const [clearMsg, setclearMsg] = useState('');

  const errorHandler = useErrorHandler();

  const clearInputState = () => {
    accountInput2(() => undefined);
    residentInput2(() => undefined);
    subsidyInput2(() => undefined);
    taxInput2(() => undefined);
  };
  const clearListState = () => {
    accountReqList2(() => undefined);
    accountVCList2(() => undefined);
    residentReqList2(() => undefined);
    residentVCList2(() => undefined);
    subsidyReqList2(() => undefined);
    subsidyVCList2(() => undefined);
    taxReqList2(() => undefined);
    taxVCList2(() => undefined);
  };

  const clearAllState = () => {
    try {
      clearOldData();
      clearInputState();
      clearListState();
      showClearSuccessMsg();
    } catch (e) {
      errorHandler(e);
    }
  };

  const clearOldData = () => {
    VCList(() => undefined);
    accountInput(() => undefined);
    accountList(() => undefined);
    accountVCList(() => undefined);
    accountVCRequestList(() => undefined);
    dataVer(() => undefined);
    residentInput(() => undefined);
    residentList(() => undefined);
    residentVCList(() => undefined);
    residentVCRequestList(() => undefined);
    subsidyInput(() => undefined);
    subsidyList(() => undefined);
    subsidyVCList(() => undefined);
    subsidyVCRequestList(() => undefined);
    taxInputList(() => undefined);
    taxInput(() => undefined);
    taxVCList(() => undefined);
    taxVCRequestList(() => undefined);
  };

  const showClearSuccessMsg = async () => {
    setclearMsg('データクリアが完了しました。');
    await delay(5000);
    setclearMsg('');
  };

  const delay = (ms: number | undefined) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  return { clearMsg, clearInputState, clearAllState };
};

export default useDataClear;
