import useVCHandler from '@/lib/mockApp/hooks/useVCHandler';
import { VCInfo } from '@/lib/mockApp/types';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { UrlObject } from 'url';

export type VCListItemParams = {
  item: VCInfo;
  url: string | UrlObject;
  vcName: string;
};

const VCListItem = ({ item, url, vcName }: VCListItemParams) => {
  const router = useRouter();
  const vcHandler = useVCHandler();
  const [verifyResult, setVerifyResult] = useState<boolean | undefined>(
    undefined
  );

  useEffect(() => {
    (async () => {
      let result: boolean = item.vc.verified;
      if (item.vc.payload.vc.credentialSubject.vp && result) {
        const verifyVPResult = await vcHandler.verifyVP(
          item.vc.payload.vc.credentialSubject.vp
        );
        result = verifyVPResult ? verifyVPResult.vpRevoked : false;
      }
      setVerifyResult(result);
    })();
  });

  return (
    <>
      <li
        className={'flex w-full h-16 text-xs border-b border-color-gainsboro'}
      >
        <div
          className={
            'flex w-[390px] justify-between mx-auto px-2 gap-1 items-center'
          }
        >
          <span className={'w-fit'}>
            {item.issueDate}
          </span>
          <div className={`flex flex-col w-28} `}>
            <span>{item.fullName}</span>
            <span>{vcName}</span>
          </div>
          <div className={'flex w-10 h-12 items-center'}>
            {typeof verifyResult === 'boolean' ? (
              verifyResult && item.ApplicationStatus.revokeStatus ? (
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
          <span className={'w-fit text-color-gray-accepted'}>
            {item.ApplicationStatus.revokeStatus ? '発行済' : '取消済'}
          </span>
          <button
            onClick={() => {
              router.push(url);
            }}
            className={
              'w-18 h-7 leading-7 border border-color-gray rounded-lg block text-base text-center font-bold'
            }
          >
            照会
          </button>
        </div>
      </li>
    </>
  );
};

export default VCListItem;
