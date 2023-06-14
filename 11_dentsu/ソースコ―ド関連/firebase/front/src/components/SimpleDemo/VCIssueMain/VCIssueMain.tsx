import DidInfo from '@/components/DidInfo';
import BackButton from '@/components/BackButton';

import useVCIssueMain from './useVCIssueMain';

const VCIssueMain = () => {
  const {
    vcRequestForDisplay,
    vcRequestVerified,
    vcBeforeIssuingForDisplay,
    vcAfterIssuingForDisplay,
    onVerifyVCRequestHandler,
    onIssueVCHandler,
    vcIssued,
    vcIssuing,
    issuerDidAccount,
    holderDidAccount,
    issueTimestamp,
  } = useVCIssueMain();
  const VCRequestVerify = () => (
    <>
      <div className="pt-2">住民票VCリクエストの内容</div>
      <textarea
        value={vcRequestForDisplay}
        rows={12}
        cols={50}
        readOnly={true}
      ></textarea>
      <div>
        <button
          onClick={onVerifyVCRequestHandler}
          className="inline-block w-20 border-2 border-blue-500 hover:bg-blue-400 hover:text-white rounded-full text-center mr-4"
        >
          検証
        </button>
      </div>
    </>
  );

  const VCBeforeIssuing = () => (
    <>
      <div className="pt-2">住民票VC発行前の内容</div>
      <textarea
        value={vcBeforeIssuingForDisplay}
        rows={5}
        cols={50}
        readOnly={true}
      ></textarea>
      <div>
        <button
          onClick={onIssueVCHandler}
          className="inline-block w-20 border-2 border-blue-500 hover:bg-blue-400 hover:text-white rounded-full text-center mr-4"
        >
          発行
        </button>
        {vcIssuing && <span className="text-yellow-500">Issuing...</span>}
        {vcIssued && <span className="text-blue-500">Done</span>}
      </div>
    </>
  );

  const VCAfterIssuing = () => (
    <>
      <div className="pt-2">住民票VC発行後の内容</div>
      <textarea
        value={vcAfterIssuingForDisplay}
        rows={15}
        cols={50}
        readOnly={true}
      ></textarea>
    </>
  );

  return (
    <div>
      <div className="py-2">
        <BackButton url="./simple-demo" />
      </div>
      <p className="w-fit border-dashed border-4 p-4 mb-2">
        証明者が申請者の住民票VCリクエストを検証します。
        <br />
        検証がOKなら、証明者が申請者の住民票VCを発行します。
      </p>
      <DidInfo
        name="証明者"
        didAccount={issuerDidAccount}
        timestamp={issueTimestamp}
      />
      <DidInfo name="申請者" didAccount={holderDidAccount} />

      {!vcRequestVerified && <VCRequestVerify />}
      {vcRequestVerified && !vcIssued && <VCBeforeIssuing />}
      {vcIssued && <VCAfterIssuing />}
    </div>
  );
};

export default VCIssueMain;
