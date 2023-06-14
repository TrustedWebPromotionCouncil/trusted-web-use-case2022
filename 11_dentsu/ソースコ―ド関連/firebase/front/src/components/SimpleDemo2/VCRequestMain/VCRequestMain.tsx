import DIDInfo2 from '@/components/DIDInfo2';
import BackButton from '@/components/BackButton';
import useVCRequestMain from './useVCRequestMain';

const VCRequestMain = () => {
  const {
    requestContent,
    requestResult,
    onVCRequestClickHandler,
    vcRequested,
    holderDID,
    holderAddress,
    issuerDID,
    issuerAddress,
  } = useVCRequestMain();

  return (
    <div>
      <div className="py-2">
        <BackButton url="./simple-demo2" />
      </div>
      <p className="w-fit border-dashed border-4 p-4 mb-2">
        申請者が証明者に住民票VCの発行を依頼します。
      </p>
      <DIDInfo2 name="申請者" did={holderDID} address={holderAddress} />
      <DIDInfo2 name="証明者" did={issuerDID} address={issuerAddress} />

      <div className="pt-2">依頼内容</div>
      <textarea
        value={requestContent}
        rows={5}
        cols={50}
        readOnly={true}
      ></textarea>
      {requestResult && (
        <>
          <div className="pt-2">依頼結果</div>
          <textarea
            value={requestResult}
            rows={20}
            cols={86}
            readOnly={true}
          ></textarea>
        </>
      )}
      <div>
        <button
          onClick={onVCRequestClickHandler}
          className="inline-block w-20 border-2 border-blue-500 hover:bg-blue-400 hover:text-white rounded-full text-center mr-4"
        >
          依頼
        </button>
        {vcRequested && <span className="text-blue-500">Done</span>}
      </div>
    </div>
  );
};

export default VCRequestMain;
