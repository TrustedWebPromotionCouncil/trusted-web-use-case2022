import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useErrorHandler } from 'react-error-boundary';
import { ApplicationInfo } from '@/lib/mockApp/types';

import {
  residentReqList2State,
  accountReqList2State,
  taxReqList2State,
  subsidyReqList2State,
  residentVCList2State,
  accountVCList2State,
  taxVCList2State,
  subsidyVCList2State,
} from '@/lib/mockApp/states';
import useListPage from '@/lib/mockApp/hooks/useListPage';

const useApplicationListMain = () => {
  const { getApplicationInfoList } = useListPage();
  const errorHandler = useErrorHandler();

  const residentReqList = useRecoilValue(residentReqList2State);
  const accountReqList = useRecoilValue(accountReqList2State);
  const taxReqList = useRecoilValue(taxReqList2State);
  const subsidyReqList = useRecoilValue(subsidyReqList2State);
  const residentVCList = useRecoilValue(residentVCList2State);
  const accountVCList = useRecoilValue(accountVCList2State);
  const taxVCList = useRecoilValue(taxVCList2State);
  const subsidyVCList = useRecoilValue(subsidyVCList2State);

  const [residentList, setResidentList] = useState<ApplicationInfo[]>([]);
  const [accountList, setAccountList] = useState<ApplicationInfo[]>([]);
  const [taxList, setTaxList] = useState<ApplicationInfo[]>([]);
  const [subsidyList, setSubsidyList] = useState<ApplicationInfo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      (async () => {
        if (residentReqList) {
          const residentList = await getApplicationInfoList(
            residentReqList,
            residentVCList
          );
          residentList && setResidentList(residentList);
        }
        if (accountReqList) {
          const accountList = await getApplicationInfoList(
            accountReqList,
            accountVCList
          );
          accountList && setAccountList(accountList);
        }
        if (taxReqList) {
          const taxList = await getApplicationInfoList(taxReqList, taxVCList);
          taxList && setTaxList(taxList);
        }
        if (subsidyReqList) {
          const subsidyList = await getApplicationInfoList(
            subsidyReqList,
            subsidyVCList
          );
          subsidyList && setSubsidyList(subsidyList);
        }
        setIsLoading(() => false);
      })();
    } catch (e) {
      errorHandler(e);
    }
  }, [
    residentVCList,
    accountVCList,
    taxVCList,
    subsidyVCList,
    accountReqList,
    errorHandler,
    residentReqList,
    subsidyReqList,
    taxReqList,
  ]);

  return { residentList, accountList, taxList, subsidyList, isLoading };
};

export default useApplicationListMain;
