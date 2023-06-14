import { useRecoilValue } from 'recoil';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/ja';
import { useErrorHandler } from 'react-error-boundary';

import useVCHandler from '@/lib/mockApp/hooks/useVCHandler';
import {
  AccountContent,
  ResidentContent,
  SubsidyContent,
  TaxContent,
  verifyVPResultType,
} from '@/lib/mockApp/types';
import {
  residentVCList2State,
  accountVCList2State,
  taxVCList2State,
  subsidyVCList2State,
} from '@/lib/mockApp/states';
import {
  isAccountContent,
  isResidentContent,
  isSubsidyContent,
  isTaxContent,
} from '@/lib/mockApp/utils/typeGuard';

const useVCInquiryMain = () => {
  const router = useRouter();
  const vcHandler = useVCHandler();
  const errorHandler = useErrorHandler();

  const [type, setType] = useState('');
  const [idx, setIdx] = useState(0);
  const [verifyVPResult, setVerifyVPResult] = useState<verifyVPResultType>();
  const [applicationDate, setApplicationDate] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [revokeStatus, setRevokeStatus] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [residentInput, setResidentInput] = useState<ResidentContent>();
  const [accountInput, setAccountInput] = useState<AccountContent>();
  const [taxInput, setTaxInput] = useState<TaxContent>();
  const [subsidyInput, setSubsidyInput] = useState<SubsidyContent>();

  const residentVCList = useRecoilValue(residentVCList2State);
  const accountVCList = useRecoilValue(accountVCList2State);
  const taxVCList = useRecoilValue(taxVCList2State);
  const subsidyVCList = useRecoilValue(subsidyVCList2State);

  dayjs.locale('ja');

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(() => true);

        if (
          typeof router.query.idx === 'string' &&
          typeof router.query.type === 'string'
        ) {
          setType(router.query.type);
          setIdx(parseInt(router.query.idx));
          if (router.query.type === '住民票' && residentVCList) {
            const vc = residentVCList[parseInt(router.query.idx) - 1];
            const verifiedVC = await vcHandler.verifyVC(vc.jwt);
            if (
              verifiedVC &&
              isResidentContent(
                verifiedVC.verifiedJWT.payload.vc.credentialSubject
              )
            ) {
              setResidentInput(
                verifiedVC.verifiedJWT.payload.vc.credentialSubject
              );
              setApplicationDate(
                verifiedVC.verifiedJWT.payload.vc.credentialSubject.iat
                  ? dayjs
                      .unix(
                        verifiedVC.verifiedJWT.payload.vc.credentialSubject.iat
                      )
                      .format('YY/MM/DD HH:mm')
                  : ''
              );
              setIssueDate(
                dayjs(
                  verifiedVC.verifiedJWT.verifiableCredential.issuanceDate
                ).format('YY/MM/DD HH:mm')
              );
              setRevokeStatus(verifiedVC.revoked);
            }
          } else if (router.query.type === '口座実在証明書' && accountVCList) {
            const vc = accountVCList[parseInt(router.query.idx) - 1];
            const verifiedVC = await vcHandler.verifyVC(vc.jwt);
            if (
              verifiedVC &&
              isAccountContent(
                verifiedVC.verifiedJWT.payload.vc.credentialSubject
              )
            ) {
              setAccountInput(
                verifiedVC.verifiedJWT.payload.vc.credentialSubject
              );
              setApplicationDate(
                verifiedVC.verifiedJWT.payload.vc.credentialSubject.iat
                  ? dayjs
                      .unix(
                        verifiedVC.verifiedJWT.payload.vc.credentialSubject.iat
                      )
                      .format('YY/MM/DD HH:mm')
                  : ''
              );
              setIssueDate(
                dayjs(
                  verifiedVC.verifiedJWT.verifiableCredential.issuanceDate
                ).format('YY/MM/DD HH:mm')
              );
              setRevokeStatus(verifiedVC.revoked);
            }
          } else if (router.query.type === '納税証明書' && taxVCList) {
            const vc = taxVCList[parseInt(router.query.idx) - 1];
            const verifiedVC = await vcHandler.verifyVC(vc.jwt);
            if (
              verifiedVC &&
              isTaxContent(verifiedVC.verifiedJWT.payload.vc.credentialSubject)
            ) {
              setTaxInput(verifiedVC.verifiedJWT.payload.vc.credentialSubject);
              setApplicationDate(
                verifiedVC.verifiedJWT.payload.vc.credentialSubject.iat
                  ? dayjs
                      .unix(
                        verifiedVC.verifiedJWT.payload.vc.credentialSubject.iat
                      )
                      .format('YY/MM/DD HH:mm')
                  : ''
              );
              setIssueDate(
                dayjs(
                  verifiedVC.verifiedJWT.verifiableCredential.issuanceDate
                ).format('YY/MM/DD HH:mm')
              );
              setRevokeStatus(verifiedVC.revoked);
            }
          } else if (router.query.type === '補助金申請' && subsidyVCList) {
            const vc = subsidyVCList[parseInt(router.query.idx) - 1];
            const verifiedVC = await vcHandler.verifyVC(vc.jwt);
            const verifiedVP = await vcHandler.verifyVP(
              verifiedVC?.verifiedJWT.payload.vc.credentialSubject.vp
            );
            if (
              verifiedVC &&
              isSubsidyContent(
                verifiedVC.verifiedJWT.payload.vc.credentialSubject
              )
            ) {
              setSubsidyInput(
                verifiedVC.verifiedJWT.payload.vc.credentialSubject
              );
              setApplicationDate(
                verifiedVC.verifiedJWT.payload.vc.credentialSubject.iat
                  ? dayjs
                      .unix(
                        verifiedVC.verifiedJWT.payload.vc.credentialSubject.iat
                      )
                      .format('YY/MM/DD HH:mm')
                  : ''
              );
              setIssueDate(
                dayjs(
                  verifiedVC.verifiedJWT.verifiableCredential.issuanceDate
                ).format('YY/MM/DD HH:mm')
              );
              if (
                isSubsidyContent(
                  verifiedVC.verifiedJWT.payload.vc.credentialSubject
                )
              ) {
                let index = 0;
                const residentVerifyStatus =
                  Number(
                    verifiedVC.verifiedJWT.payload.vc.credentialSubject
                      .residentVC
                  ) > -1 && verifiedVP
                    ? verifiedVP.vcsRevoked[index]
                    : true;
                Number(
                  verifiedVC.verifiedJWT.payload.vc.credentialSubject.residentVC
                ) > -1 && index++;
                const accountVerifyStatus =
                  Number(
                    verifiedVC.verifiedJWT.payload.vc.credentialSubject
                      .accountVC
                  ) > -1 && verifiedVP
                    ? verifiedVP.vcsRevoked[index]
                    : true;
                Number(
                  verifiedVC.verifiedJWT.payload.vc.credentialSubject.accountVC
                ) > -1 && index++;
                const taxVerifyStatus =
                  Number(
                    verifiedVC.verifiedJWT.payload.vc.credentialSubject.taxVC
                  ) > -1 && verifiedVP
                    ? verifiedVP.vcsRevoked[index]
                    : true;

                const vcVerifyStatus: verifyVPResultType = {
                  accountVerifyStatus,
                  residentVerifyStatus,
                  taxVerifyStatus,
                };
                setVerifyVPResult(vcVerifyStatus);
              }
              setRevokeStatus(verifiedVC.revoked);
            }
          }
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
    router.query,
    errorHandler,
  ]);

  const back = () => {
    router.push('/61_VCList');
  };

  return {
    type,
    idx,
    applicationDate,
    issueDate,
    revokeStatus,
    residentInput,
    accountInput,
    taxInput,
    subsidyInput,
    isLoading,
    verifyVPResult,
    back,
  };
};

export default useVCInquiryMain;
