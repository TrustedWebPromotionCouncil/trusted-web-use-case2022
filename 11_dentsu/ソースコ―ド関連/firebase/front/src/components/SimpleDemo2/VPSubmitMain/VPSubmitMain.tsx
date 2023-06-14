import DIDInfo2 from '@/components/DIDInfo2';
import BackButton from '@/components/BackButton';

import useVPSubmitMain from './useVPSubmitMain';

const VPSubmitMain = () => {
  const {
    vcForDisplay,
    vpForDisplay,
    vpSubmitted,
    holderDID,
    holderAddress,
    verifierDID,
    verifierAddress,
    issuerDID,
    issuerAddress,
    onVPSubmitClickHandler,
  } = useVPSubmitMain();

  const ContentBeforeSubmitting = () => {
    return (
      <>
        <div className="pt-2">住民票VCの内容</div>
        <textarea
          value={vcForDisplay}
          rows={26}
          cols={90}
          readOnly={true}
        ></textarea>
        <div>
          <button
            onClick={onVPSubmitClickHandler}
            className="inline-block w-20 border-2 border-blue-500 hover:bg-blue-400 hover:text-white rounded-full text-center mr-4"
          >
            提出
          </button>
        </div>
      </>
    );
  };

  const ContentAfterSubmitting = () => {
    return (
      <>
        <div className="pt-2">住民票VPの内容</div>
        <textarea
          value={vpForDisplay}
          rows={76}
          cols={90}
          readOnly={true}
        ></textarea>
      </>
    );
  };

  return (
    <div>
      <div className="py-2">
        <BackButton url="./simple-demo2" />
      </div>
      <p className="w-fit border-dashed border-4 p-4 mb-2">
        申請者が申請先に住民票VPを提出します。
      </p>
      <DIDInfo2 name="申請者" did={holderDID} address={holderAddress} />
      <DIDInfo2 name="申請先" did={verifierDID} address={verifierAddress} />
      <DIDInfo2 name="証明者" did={issuerDID} address={issuerAddress} />

      {vpSubmitted ? <ContentAfterSubmitting /> : <ContentBeforeSubmitting />}
    </div>
  );
};

export default VPSubmitMain;
