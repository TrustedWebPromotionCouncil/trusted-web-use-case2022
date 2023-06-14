import Header from '@/components/common/Header';
import TransitionButton from '@/components/common/TransitionButton';
import { AccountDetail,ResidentDetail,SubsidyDetail,TaxDetail, } from '../common/Forms';
import useVCInquiryMain from './useVCInquiryMain';
import Loading from '../common/Loading';

const VCDetailMain = () => {
  const {
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
  } = useVCInquiryMain();
  return (
    <>
      <Header />
      <main className={'mx-auto px-[10px] w-96'}>
        <Loading isLoading={isLoading}>
          <>
            <section>
              <div
                className={
                  'w-full h-11 px-4 bg-color-vcheader text-lg leading-11 font-bold'
                }
              >
                {type}
              </div>
              <div className={'w-72 mx-auto p-4 border-b text-center'}>
                <p className={'text-base font-bold'}>
                  {type} - VC{idx}
                </p>
                <p className={'text-xs leading-11 text-color-gray-search'}>
                  {revokeStatus ? '発行済' : '取消済'}
                </p>
                <p className={'text-xs text-color-gray-search'}>
                  申請日 {applicationDate}
                </p>
                <p className={'text-xs text-color-gray-search'}>
                  発行日 {issueDate}
                </p>
              </div>
            </section>
            <section className={'pt-2'}>
              {type === '住民票' && residentInput && (
                <ResidentDetail input={residentInput} />
              )}
              {type === '口座実在証明書' && accountInput && (
                <AccountDetail input={accountInput} />
              )}
              {type === '納税証明書' && taxInput && (
                <TaxDetail input={taxInput} />
              )}
              {type === '補助金申請' && subsidyInput && (
                <SubsidyDetail
                  input={subsidyInput}
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
          </>
        </Loading>
      </main>
    </>
  );
};

export default VCDetailMain;
