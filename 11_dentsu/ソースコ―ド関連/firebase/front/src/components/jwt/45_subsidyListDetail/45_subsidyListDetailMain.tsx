import { useRouter } from 'next/router';
import { useRecoilState } from 'recoil';
import { useEffect, useState } from 'react';
import { useErrorHandler } from 'react-error-boundary';

import {
  subsidyReqList2State,
  subsidyVCList2State,
} from '@/lib/mockApp/states';
import {
  VCListItem,
  ApplicationInfo,
  verifyVPResultType,
} from '@/lib/mockApp/types';
import { isSubsidyContent } from '@/lib/mockApp/utils/typeGuard';

import Header from '@/components/common/Header';
import ApplicationStatusArea from '@/components/jwt/common/ApplicationStatusArea';
import { urls } from '@/lib/mockApp/consts';
import ApplicationButtonArea from '@/components/jwt/common/ApplicationButtonArea';
import useDetailPage from '@/lib/mockApp/hooks/useDetailPage';
import useVCHandler from '@/lib/mockApp/hooks/useVCHandler';
import Loading from '../common/Loading';
import { SubsidyDetail } from '../common/Forms';

const SubsidyListDetailMain = () => {
  // hooks
  const router = useRouter();
  const errorHandler = useErrorHandler();
  const vcHandler = useVCHandler();
  const { getApplicationInfo } = useDetailPage();
  // recoil
  const [reqList, setReqList] = useRecoilState(subsidyReqList2State);
  const [vcList, setVCList] = useRecoilState(subsidyVCList2State);
  // states
  const [appInfo, setAppInfo] = useState<ApplicationInfo | undefined>();
  const [vcVerifyStatus, setVCVerifyStatus] = useState<
    verifyVPResultType | undefined
  >();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isIssuing, setIsIssuing] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      try {
        if (router.query.id && reqList) {
          const appInfo = await getApplicationInfo(
            router.query.id,
            reqList,
            vcList
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
            setVCVerifyStatus(vcVerifyStatus);
          }
          setAppInfo(appInfo);
        }
        setIsLoading(() => false);
      } catch (e) {
        setIsLoading(() => false);
        errorHandler(e);
      }
    })();
  }, [router.query.id, errorHandler]);

  const back = () => {
    router.push(urls.subsidyList);
  };

  const issue = async () => {
    try {
      setIsIssuing(() => true);
      if (appInfo) {
        const jwt = await vcHandler.createVC(appInfo.req.payload);
        const vcListItem: VCListItem | undefined = jwt
          ? { id: appInfo.id, jwt }
          : undefined;
        vcListItem &&
          setVCList((prev) => (prev ? [...prev, vcListItem] : [vcListItem]));
      }
      setIsIssuing(() => false);
      router.push({
        pathname: urls.subsidyListDone,
        query: { id: router.query.id, proc: 'approve' },
      });
    } catch (e) {
      setIsLoading(() => false);
      errorHandler(e);
    }
  };

  const reject = () => {
    try {
      if (appInfo) {
        setReqList((prev) =>
          prev ? prev.filter((item) => item.id !== appInfo.id) : []
        );
      }
      router.push({
        pathname: urls.subsidyListDone,
        query: { id: router.query.id, proc: 'reject' },
      });
    } catch (e) {
      setIsLoading(() => false);
      errorHandler(e);
    }
  };

  return (
    <>
      <Header />
      <main className="bg-color-background">
        <Loading isLoading={isLoading}>
          {appInfo ? (
            <>
              <ApplicationStatusArea
                applicationDate={appInfo.applicationDate}
                ApplicationStatus={appInfo.ApplicationStatus}
              />
              <div>
                {appInfo && isSubsidyContent(appInfo.req.payload) && (
                  <SubsidyDetail
                    input={appInfo.req.payload}
                    verifyResult={vcVerifyStatus}
                  />
                )}
              </div>
              <div className="py-0 px-[53px]">
                <ApplicationButtonArea
                  isIssuing={isIssuing}
                  ApplicationStatus={appInfo.ApplicationStatus}
                  issueFunc={issue}
                  rejectFunc={reject}
                  backFunc={back}
                />
              </div>
            </>
          ) : null}
        </Loading>
      </main>
    </>
  );
};

export default SubsidyListDetailMain;
