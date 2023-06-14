import { useRouter } from 'next/router';
import { useRecoilState } from 'recoil';
import { useEffect, useState } from 'react';
import { useErrorHandler } from 'react-error-boundary';

import {
  residentReqList2State,
  residentVCList2State,
} from '@/lib/mockApp/states';
import { VCListItem, ApplicationInfo } from '@/lib/mockApp/types';
import { isResidentContent } from '@/lib/mockApp/utils/typeGuard';

import Header from '@/components/common/Header';
import ApplicationStatusArea from '@/components/jwt/common/ApplicationStatusArea';
import { urls } from '@/lib/mockApp/consts';
import ApplicationButtonArea from '@/components/jwt/common/ApplicationButtonArea';
import useDetailPage from '@/lib/mockApp/hooks/useDetailPage';
import useVCHandler from '@/lib/mockApp/hooks/useVCHandler';
import Loading from '../common/Loading';
import { ResidentDetail } from '../common/Forms';

const ResidentListDetailMain = () => {
  // hooks
  const router = useRouter();
  const errorHandler = useErrorHandler();
  const vcHandler = useVCHandler();
  const { getApplicationInfo } = useDetailPage();
  // recoil
  const [reqList, setReqList] = useRecoilState(residentReqList2State);
  const [vcList, setVCList] = useRecoilState(residentVCList2State);
  // states
  const [appInfo, setAppInfo] = useState<ApplicationInfo | undefined>();
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
    router.push(urls.residentList);
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
        pathname: urls.residentListDone,
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
        pathname: urls.residentListDone,
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
              <div className="py-0 px-[53px]">
                {appInfo && isResidentContent(appInfo.req.payload) && (
                  <ResidentDetail input={appInfo.req.payload} />
                )}
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

export default ResidentListDetailMain;
