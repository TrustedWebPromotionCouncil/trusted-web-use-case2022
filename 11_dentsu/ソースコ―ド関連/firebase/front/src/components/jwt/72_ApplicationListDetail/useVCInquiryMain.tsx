import { useRecoilValue } from 'recoil';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
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

import dayjs from 'dayjs';
import 'dayjs/locale/ja';
import { useErrorHandler } from 'react-error-boundary';
import useVCHandler from '@/lib/mockApp/hooks/useVCHandler';
import useDetailPage from '@/lib/mockApp/hooks/useDetailPage';
import { ApplicationInfo, verifyVPResultType } from '@/lib/mockApp/types';
import { isSubsidyContent } from '@/lib/mockApp/utils/typeGuard';

const useVCInquiryMain = () => {
  const router = useRouter();
  const vcHandler = useVCHandler();
  const { getApplicationInfo } = useDetailPage();
  const errorHandler = useErrorHandler();

  const [type, setType] = useState('');
  const [verifyVPResult, setVerifyVPResult] = useState<verifyVPResultType>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [reqItem, setReqItem] = useState<ApplicationInfo>();

  const residentReqList = useRecoilValue(residentReqList2State);
  const accountReqList = useRecoilValue(accountReqList2State);
  const taxReqList = useRecoilValue(taxReqList2State);
  const subsidyReqList = useRecoilValue(subsidyReqList2State);
  const residentVCList = useRecoilValue(residentVCList2State);
  const accountVCList = useRecoilValue(accountVCList2State);
  const taxVCList = useRecoilValue(taxVCList2State);
  const subsidyVCList = useRecoilValue(subsidyVCList2State);

  useEffect(() => {
    try {
      (async () => {
        if (
          typeof router.query.id === 'string' &&
          typeof router.query.type === 'string'
        ) {
          const id = router.query.id;
          const type = router.query.type;
          setType(type);

          if (type === 'resident' && residentReqList) {
            const appInfo = await getApplicationInfo(
              id,
              residentReqList,
              residentVCList
            );
            setReqItem(appInfo);
          } else if (type === 'account' && accountReqList) {
            const appInfo = await getApplicationInfo(
              id,
              accountReqList,
              accountVCList
            );
            setReqItem(appInfo);
          }
          if (type === 'tax' && taxReqList) {
            const appInfo = await getApplicationInfo(id, taxReqList, taxVCList);
            setReqItem(appInfo);
          }
          if (type === 'subsidy' && subsidyReqList) {
            const appInfo = await getApplicationInfo(
              id,
              subsidyReqList,
              subsidyVCList
            );
            const verifiedVP = await vcHandler.verifyVP(appInfo.req.payload.vp);

            appInfo.ApplicationStatus.approvalStatus = verifiedVP
              ? verifiedVP.vpRevoked && appInfo.ApplicationStatus.approvalStatus
              : false;
            if (isSubsidyContent(appInfo.req.payload)) {
              let index = 0;
              const residentVerifyStatus =
                Number(appInfo.req.payload.residentVC) > -1 && verifiedVP
                  ? verifiedVP.vcsRevoked[index]
                  : true;
              Number(appInfo.req.payload.residentVC) > -1 && index++;
              const accountVerifyStatus =
                Number(appInfo.req.payload.accountVC) > -1 && verifiedVP
                  ? verifiedVP.vcsRevoked[index]
                  : true;
              Number(appInfo.req.payload.accountVC) > -1 && index++;
              const taxVerifyStatus =
                Number(appInfo.req.payload.taxVC) > -1 && verifiedVP
                  ? verifiedVP.vcsRevoked[index]
                  : true;

              const vcVerifyStatus: verifyVPResultType = {
                accountVerifyStatus,
                residentVerifyStatus,
                taxVerifyStatus,
              };
              setVerifyVPResult(vcVerifyStatus);
            }
            setReqItem(appInfo);
          }
        }
        setIsLoading(false);
      })();
    } catch (e) {
      errorHandler(e);
    }
  }, [
    residentReqList,
    accountReqList,
    taxReqList,
    subsidyReqList,
    residentVCList,
    accountVCList,
    taxVCList,
    subsidyVCList,
    router.query,
    errorHandler,
  ]);

  const getVCType = () => {
    switch (type) {
      case 'resident':
        return '住民票紐付申請';
      case 'account':
        return '口座実在証明申請';
      case 'tax':
        return '納税証明書交付申請';
      case 'subsidy':
        return '補助金申請';
      default:
        return '';
    }
  };

  const back = () => {
    router.push('/71_applicationList');
  };

  return {
    type,
    back,
    reqItem,
    isLoading,
    verifyVPResult,
    getVCType,
  };
};

export default useVCInquiryMain;
