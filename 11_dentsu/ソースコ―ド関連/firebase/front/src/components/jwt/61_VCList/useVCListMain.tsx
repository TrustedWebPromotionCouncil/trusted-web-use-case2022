import { useRecoilValue } from 'recoil';
import { useState, useEffect } from 'react';
import { useErrorHandler } from 'react-error-boundary';

import {
  residentVCList2State,
  accountVCList2State,
  taxVCList2State,
  subsidyVCList2State,
} from '@/lib/mockApp/states';
import { VCInfo } from '@/lib/mockApp/types';
import useListPage from '@/lib/mockApp/hooks/useListPage';

const useVCListMain = () => {
  const { getVCInfoList } = useListPage();

  const residentVCList = useRecoilValue(residentVCList2State);
  const accountVCList = useRecoilValue(accountVCList2State);
  const taxVCList = useRecoilValue(taxVCList2State);
  const subsidyVCList = useRecoilValue(subsidyVCList2State);

  const [residentList, setResidentList] = useState<VCInfo[]>([]);
  const [accountList, setAccountList] = useState<VCInfo[]>([]);
  const [taxList, setTaxList] = useState<VCInfo[]>([]);
  const [subsidyList, setSubsidyList] = useState<VCInfo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const errorHandler = useErrorHandler();

  useEffect(() => {
    (async () => {
      try {
        if (residentVCList) {
          const residentList = await getVCInfoList(residentVCList);
          residentList && setResidentList(residentList);
        }
        if (accountVCList) {
          const accountList = await getVCInfoList(accountVCList);
          accountList && setAccountList(accountList);
        }
        if (taxVCList) {
          const taxList = await getVCInfoList(taxVCList);
          taxList && setTaxList(taxList);
        }
        if (subsidyVCList) {
          const subsidyList = await getVCInfoList(subsidyVCList);
          subsidyList && setSubsidyList(subsidyList);
        }
        setIsLoading(() => false);
      } catch (e) {
        errorHandler(e);
      }
    })();
  }, [
    residentVCList,
    accountVCList,
    taxVCList,
    subsidyVCList,
    errorHandler,
  ]);

  return { residentList, accountList, taxList, subsidyList, isLoading };
};

export default useVCListMain;
