import { UrlObject } from 'url';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ApplicationInfo } from '@/lib/mockApp/types';
import useVCHandler from '@/lib/mockApp/hooks/useVCHandler';
import { isSubsidyContent } from '@/lib/mockApp/utils/typeGuard';

export type ApplicationListItemParams = {
  item: ApplicationInfo;
  url: string | UrlObject;
};

const ApplicationListItem = ({ item, url }: ApplicationListItemParams) => {
  // hooks
  const router = useRouter();
  const vcHandler = useVCHandler();
  // states
  const [revoked, setRevoked] = useState<boolean | undefined>(undefined);
  const [approved, setApproved] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      if (isSubsidyContent(item.req.payload)) {
        const verifyVP = await vcHandler.verifyVP(item.req.payload.vp);
        setApproved(verifyVP ? verifyVP.vpRevoked : false);
      }
      const verify = item.vc ? await vcHandler.verifyVC(item.vc) : undefined;
      setRevoked(verify ? verify.revoked : true);
    })();
  }, [item]);

  return (
    <>
      <li
        className={'flex w-full h-16 text-sm border-b border-color-gainsboro'}
      >
        <div
          className={
            'flex w-[390px] justify-between mx-auto px-2 gap-1 items-center'
          }
        >
          <span className={'pr-2'}>{item.applicationDate}</span>
          <span className={'w-18'}>{item.fullName}</span>
          <div className={'flex items-center w-12 h-12'}>
            {typeof revoked === 'boolean' ? (
              item.ApplicationStatus.approvalStatus && approved && revoked ? (
                <img
                  src="./authenticated.svg"
                  alt=""
                  className="inline-block"
                />
              ) : (
                <img src="./warning.svg" className={'mx-auto'} />
              )
            ) : null}
          </div>
          <span
            className={
              'text-center w-18 ' +
              (item.ApplicationStatus.issuedStatus
                ? 'text-color-gray-accepted'
                : 'text-color-warnig')
            }
          >
            {typeof revoked === 'boolean'
              ? item.ApplicationStatus.issuedStatus
                ? revoked
                  ? '承認済'
                  : '取消済'
                : '未承認'
              : null}
          </span>
          <button
            onClick={() => {
              router.push(url);
            }}
            className={
              'w-18 h-7 leading-7 border border-color-gray rounded-lg block ml-auto text-base text-center font-bold'
            }
          >
            照会
          </button>
        </div>
      </li>
    </>
  );
};

export default ApplicationListItem;
