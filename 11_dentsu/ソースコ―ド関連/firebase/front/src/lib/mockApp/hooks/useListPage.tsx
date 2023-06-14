import dayjs from 'dayjs';
import 'dayjs/locale/ja';
import {
  ApplicationInfo,
  VCInfo,
  VCList,
  VCReqList,
  VerifiedVCReqListItem,
} from '../types';
import { sortInfoList } from '../utils';
import useVCHandler from './useVCHandler';

const useListPage = () => {
  const vcHandler = useVCHandler();
  dayjs.locale('ja');

  const getApplicationInfoList = async (
    reqList: VCReqList,
    vcList: VCList | undefined,
    applicant: boolean = true
  ) => {
    if (reqList) {
      const applicationInfoList: ApplicationInfo[] = [];
      await Promise.all(
        reqList.map(async (item) => {
          const verifiedJWT = await vcHandler.verifyVCRequest(item.jwt);

          if (verifiedJWT) {
            const verifiedReqListItem: VerifiedVCReqListItem = {
              id: item.id,
              jwt: verifiedJWT,
            };

            const vc = vcList
              ? vcList.find((v) => v.id === verifiedReqListItem.id)
              : undefined;
            const verifiedVC = vc
              ? await vcHandler.verifyVC(vc.jwt)
              : undefined;

            const ApplicationInfoItem: ApplicationInfo = {
              id: verifiedReqListItem.id,
              fullName: verifiedReqListItem.jwt.payload.fullName,
              req: verifiedReqListItem.jwt,
              vc: vc?.jwt,
              applicationDate: verifiedReqListItem.jwt.payload.iat
                ? dayjs
                    .unix(verifiedReqListItem.jwt.payload.iat)
                    .format(applicant ? 'YY/MM/DD' : 'M月D日(ddd)')
                : '',
              ApplicationStatus: {
                approvalStatus: verifiedReqListItem.jwt.verified,
                issuedStatus: !!vc,
                revokeStatus: verifiedVC ? verifiedVC.revoked : true,
              },
              sortIdx: verifiedReqListItem.jwt.payload.iat
                ? dayjs
                    .unix(verifiedReqListItem.jwt.payload.iat)
                    .format('YYYY-MM-DD HH:mm:ss')
                : '',
            };

            applicationInfoList.push(ApplicationInfoItem);
          }
        })
      );

      return sortInfoList(applicationInfoList, 'desc');
    }
  };

  const getVCInfoList = async (vcList: VCList, applicant: boolean = true) => {
    if (vcList) {
      const vcInfoList: VCInfo[] = [];
      await Promise.all(
        vcList.map(async (item) => {
          const verifiedJWT = await vcHandler.verifyVC(item.jwt);

          if (verifiedJWT) {
            const vcInfoItem: VCInfo = {
              id: item.id,
              fullName:
                verifiedJWT.verifiedJWT.payload.vc.credentialSubject.fullName,
              vc: verifiedJWT.verifiedJWT,
              applicationDate: verifiedJWT.verifiedJWT.payload.vc.credentialSubject.iat
                ? dayjs
                    .unix(verifiedJWT.verifiedJWT.payload.vc.credentialSubject.iat)
                    .format(applicant ? 'YY/MM/DD' : 'M月D日(ddd)')
                : '',
              issueDate: verifiedJWT.verifiedJWT.verifiableCredential
                .issuanceDate
                ? dayjs(
                    verifiedJWT.verifiedJWT.verifiableCredential.issuanceDate
                  ).format(applicant ? 'YY/MM/DD' : 'M月D日(ddd)')
                : '',
              ApplicationStatus: {
                approvalStatus:
                  verifiedJWT.revoked && verifiedJWT.verifiedJWT.verified,
                issuedStatus: true,
                revokeStatus: verifiedJWT.revoked,
              },
              sortIdx: verifiedJWT.verifiedJWT.verifiableCredential.issuanceDate
                ? dayjs(
                    verifiedJWT.verifiedJWT.verifiableCredential.issuanceDate
                  ).format('YYYY-MM-DD HH:mm:ss')
                : '',
            };

            vcInfoList.push(vcInfoItem);
          }
        })
      );

      return sortInfoList(vcInfoList, 'desc');
    }
  };

  return { getApplicationInfoList, getVCInfoList };
};

export default useListPage;
