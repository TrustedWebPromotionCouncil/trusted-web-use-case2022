import dayjs from 'dayjs';
import 'dayjs/locale/ja';
import { ApplicationInfo, VCInfo, VCList, VCReqList } from '../types';
import useVCHandler from './useVCHandler';

const useDetailPage = () => {
  const vcHandler = useVCHandler();
  dayjs.locale('ja');

  const getApplicationInfo = async (
    id: unknown,
    reqListState: VCReqList,
    vcListState: VCList | undefined
  ): Promise<ApplicationInfo> => {
    if (typeof id === 'string') {
      if (reqListState) {
        const reqItem = reqListState.find((item) => item.id === id);
        const vcItem = vcListState
          ? vcListState.find((item) => item.id === id)
          : null;

        const verifiedReqJWT = reqItem
          ? await vcHandler.verifyVCRequest(reqItem.jwt)
          : undefined;
        const verifiedJWT = vcItem
          ? await vcHandler.verifyVC(vcItem.jwt)
          : undefined;
        if (verifiedReqJWT) {
          const appInfo: ApplicationInfo | undefined = verifiedReqJWT
            ? {
                id,
                fullName: verifiedReqJWT.payload.fullName,
                req: verifiedReqJWT,
                vc: vcItem?.jwt,
                applicationDate: verifiedReqJWT.payload.iat
                  ? dayjs
                      .unix(verifiedReqJWT.payload.iat)
                      .format('YY/MM/DD HH:mm')
                  : '',
                ApplicationStatus: {
                  approvalStatus: verifiedReqJWT.verified,
                  issuedStatus: vcItem ? true : false,
                  revokeStatus: verifiedJWT ? verifiedJWT.revoked : true,
                },
              }
            : undefined;

          if (appInfo) {
            return appInfo;
          }
        }
        throw new Error('reqListState is undefined');
      }
      throw new Error('reqListState is undefined');
    }
    throw new Error('invalid typeof ID');
  };

  const getVCInfo = async (
    id: unknown,
    vcListState: VCList
  ): Promise<VCInfo> => {    
    if (typeof id === 'string') {
      if (vcListState) {
        const vc = vcListState.find((item) => item.id === id);
        const verifiedJWT = vc ? await vcHandler.verifyVC(vc.jwt) : undefined;

        if (verifiedJWT) {          
          const vcInfoItem: VCInfo = {
            id,
            fullName:
              verifiedJWT.verifiedJWT.payload.vc.credentialSubject.fullName,
            vc: verifiedJWT.verifiedJWT,
            applicationDate: verifiedJWT.verifiedJWT.payload.vc.credentialSubject.iat
              ? dayjs
                  .unix(verifiedJWT.verifiedJWT.payload.vc.credentialSubject.iat)
                  .format('YY/MM/DD HH:mm')
              : '',
            issueDate: verifiedJWT.verifiedJWT.verifiableCredential.issuanceDate
              ? dayjs(
                  verifiedJWT.verifiedJWT.verifiableCredential.issuanceDate
                ).format('YY/MM/DD HH:mm')
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

          if (vcInfoItem) {
            return vcInfoItem;
          }
        }
        throw new Error('verifiedJWT is undefined');
      }
      throw new Error('vcListState is undefined');
    }
    throw new Error('invalid typeof ID');
  };
  return { getApplicationInfo, getVCInfo };
};

export default useDetailPage;
