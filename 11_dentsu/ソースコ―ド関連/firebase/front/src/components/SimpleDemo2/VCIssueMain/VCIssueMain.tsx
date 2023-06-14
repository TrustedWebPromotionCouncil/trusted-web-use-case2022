import DIDInfo2 from '@/components/DIDInfo2';
import BackButton from '@/components/BackButton';

import useVCIssueMain from './useVCIssueMain';

const VCIssueMain = () => {
  const {
    vcRequestForDisplay,
    vcForDisplay,
    onIssueVCHandler,
    vcIssued,
    vcIssuing,
    issuerDID,
    issuerAddress,
    holderDID,
    holderAddress,
    issueTimestamp,
  } = useVCIssueMain();
  const VCBeforeIssuing = () => (
    <>
      <div className="pt-2">住民票VCリクエストの内容</div>
      <textarea
        value={vcRequestForDisplay}
        rows={12}
        cols={70}
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
      <div className="pt-2">住民票VCの内容</div>
      <textarea
        value={vcForDisplay}
        rows={37}
        cols={90}
        readOnly={true}
      ></textarea>
    </>
  );

  return (
    <div>
      <div className="py-2">
        <BackButton url="./simple-demo2" />
      </div>
      <p className="w-fit border-dashed border-4 p-4 mb-2">
        証明者が申請者の住民票VCを発行します。
      </p>
      <DIDInfo2
        name="証明者"
        did={issuerDID}
        address={issuerAddress}
        timestamp={issueTimestamp}
      />
      <DIDInfo2 name="申請者" did={holderDID} address={holderAddress} />

      {!vcIssued && <VCBeforeIssuing />}
      {vcIssued && <VCAfterIssuing />}
    </div>
  );
};

export default VCIssueMain;
