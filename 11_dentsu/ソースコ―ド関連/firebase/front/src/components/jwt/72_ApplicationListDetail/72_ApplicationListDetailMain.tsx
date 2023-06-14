import Header from '@/components/common/Header';
import Loading from '../common/Loading';
import TransitionButton from '@/components/common/TransitionButton';
import useVCInquiryMain from './useVCInquiryMain';
import {
  AccountDetail,
  ResidentDetail,
  SubsidyDetail,
  TaxDetail,
} from '../common/Forms';
import {
  isAccountContent,
  isResidentContent,
  isSubsidyContent,
  isTaxContent,
} from '@/lib/mockApp/utils/typeGuard';

const ApplicationListDetailMain = () => {
  const {
    type,
    back,
    reqItem,
    isLoading,
    verifyVPResult,
    getVCType,
  } = useVCInquiryMain();
  return (
    <>
      <Header />
      <Loading isLoading={isLoading}>
        {reqItem ? (
          <main className={'mx-auto p-[10px] w-96'}>
            <section>
              <div className={'w-72 mx-auto px-4 pb-4 border-b text-center'}>
                <p className={'text-sm font-bold'}>{getVCType()}</p>
                <p
                  className={`text-xs leading-11 ${
                    reqItem.ApplicationStatus.issuedStatus
                      ? 'text-color-gray-search'
                      : 'text-color-required'
                  }`}
                >
                  {reqItem.ApplicationStatus.issuedStatus
                    ? reqItem.ApplicationStatus.revokeStatus
                      ? '承認済'
                      : '取消済'
                    : '承認待ち'}
                </p>
                <p className={'text-xs text-color-gray-search'}>
                  申請日 {reqItem.applicationDate}
                </p>
              </div>
            </section>
            <section className={'py-4'}>
              {type === 'resident' &&
                isResidentContent(reqItem.req.payload) && (
                  <ResidentDetail input={reqItem.req.payload} />
                )}
              {type === 'account' && isAccountContent(reqItem.req.payload) && (
                <AccountDetail input={reqItem.req.payload} />
              )}
              {type === 'tax' && isTaxContent(reqItem.req.payload) && (
                <TaxDetail input={reqItem.req.payload} />
              )}
              {type === 'subsidy' && isSubsidyContent(reqItem.req.payload) && (
                <SubsidyDetail
                  input={reqItem.req.payload}
                  verifyResult={verifyVPResult}
                />
              )}
            </section>
            <section className={'mx-auto flex w-70'}>
              <TransitionButton
                text="戻る"
                type={'prev'}
                currentUser={'applicant'}
                onClick={back}
              />
            </section>
          </main>
        ) : null}
      </Loading>
    </>
  );
};

export default ApplicationListDetailMain;
