import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import Header from '@/components/common/Header';
import Loading from '@/components/common/Loading';
import { useErrorHandler } from 'react-error-boundary';
import { AccountDetail } from '../common/Forms';
import useDetailPage from '@/lib/mockApp/hooks/useDetailPage';
import { accountVCList2State } from '@/lib/mockApp/states';
import { VCInfo } from '@/lib/mockApp/types';
import { isAccountContent } from '@/lib/mockApp/utils/typeGuard';
import useVCHandler from '@/lib/mockApp/hooks/useVCHandler';
import { urls } from '@/lib/mockApp/consts';

const AccountVCListDetailMain = () => {
  const router = useRouter();
  const { getVCInfo } = useDetailPage();
  const vcHandler = useVCHandler();
  const errorHandler = useErrorHandler();

  const vcList = useRecoilValue(accountVCList2State);

  const [vcInfo, setVCInfo] = useState<VCInfo>();
  const [isLoading, setIsLoading] = useState(true);
  const [isRevoking, setIsRevoking] = useState(false);

  useEffect(() => {
    try {
      (async () => {
        if (vcList && router.query.id) {
          setVCInfo(await getVCInfo(router.query.id, vcList));
        }
        setIsLoading(() => false);
      })();
    } catch (e) {
      errorHandler(e);
    }
  }, [vcList, router.query, errorHandler]);

  const revoke = async () => {
    try {
      setIsRevoking(true);
      if (vcInfo) {
        await vcHandler.revokeVC(vcInfo.vc);
      }
      setIsRevoking(false);
      router.push(urls.accountVCListDone);
    } catch (e) {
      setIsRevoking(false);
      errorHandler(e);
    }
  };

  return (
    <>
      <Header />
      <main className="bg-color-background">
        {vcInfo ? (
          <>
            <section className={`mb-4`}>
              <div className={'w-72 mx-auto p-4 border-b text-center'}>
                <p
                  className={'text-base font-bold'}
                >{`口座実在証明書 VC${router.query.idx}`}</p>

                <div
                  className={
                    'flex flex-col items-center gap-2 mx-auto mt-2 pb-4 border-b'
                  }
                >
                  {vcInfo.ApplicationStatus.approvalStatus ? (
                    <p
                      className={
                        'relative text-xs text-color-gray-search leading-relaxed'
                      }
                    >
                      <img
                        src="/authenticated.svg"
                        className={
                          'absolute top-0 -translate-y-3 -translate-x-full'
                        }
                      />
                      検証OK
                    </p>
                  ) : (
                    <p className={'relative text-xs leading-relaxed'}>
                      <img
                        src="/warning.svg"
                        className={'absolute -translate-x-full pr-2'}
                      />
                      検証NG
                    </p>
                  )}
                  <p className={'text-xs text-color-gray-search'}>
                    {vcInfo.ApplicationStatus.revokeStatus
                      ? '発行済'
                      : '取消済'}
                  </p>
                  <p className={'text-xs text-color-gray-search'}>
                    申請日 {vcInfo.applicationDate}
                  </p>
                  <p className={'text-xs text-color-gray-search'}>
                    発行日 {vcInfo.issueDate}
                  </p>
                </div>
              </div>
            </section>
            {isAccountContent(vcInfo.vc.payload.vc.credentialSubject) ? (
              <AccountDetail input={vcInfo.vc.payload.vc.credentialSubject} />
            ) : null}
            <div className={'relative w-70 mx-auto'}>
              {isRevoking ? (
                <span
                  className={
                    'absolute right-0 -translate-y-1/2 text-sm leading-relaxed text-yellow-500'
                  }
                >
                  VC取消中...
                </span>
              ) : null}
            </div>
            <div className="w-70 mx-auto py-0">
              <div className="pt-4 pb-2 flex justify-between">
                <button
                  onClick={() => router.back()}
                  className="input-form-button-white"
                >
                  戻る
                </button>
                {vcInfo.ApplicationStatus.revokeStatus && (
                  <button onClick={revoke} className="input-form-button-red">
                    発行取消
                  </button>
                )}
              </div>
            </div>
          </>
        ) : null}
        <Loading isLoading={isLoading} />
      </main>
    </>
  );
};

export default AccountVCListDetailMain;
