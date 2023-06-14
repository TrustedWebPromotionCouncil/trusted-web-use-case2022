import DIDInfo2 from '@/components/DIDInfo2';
import BackButton from '@/components/BackButton';

import useVPVerifyMain from './useVPVerifyMain';

const VPSubmitMain = () => {
  const {
    vpForDisplay,
    vpVerified,
    holderDID,
    holderAddress,
    verifierDID,
    verifierAddress,
    issuerDID,
    issuerAddress,
    onVPVerifyClickHandler,
  } = useVPVerifyMain();

  return (
    <div>
      <div className="py-2">
        <BackButton url="./simple-demo2" />
      </div>
      <p className="w-fit border-dashed border-4 p-4 mb-2">
        申請先が住民票VPを検証します。
      </p>
      <DIDInfo2 name="申請先" did={verifierDID} address={verifierAddress} />
      <DIDInfo2 name="申請者" did={holderDID} address={holderAddress} />
      <DIDInfo2 name="証明者" did={issuerDID} address={issuerAddress} />

      <div className="pt-2">住民票VPの内容</div>
      <textarea
        value={vpForDisplay}
        rows={26}
        cols={90}
        readOnly={true}
      ></textarea>
      <div>
        <button
          onClick={onVPVerifyClickHandler}
          className="inline-block w-20 border-2 border-blue-500 hover:bg-blue-400 hover:text-white rounded-full text-center mr-4"
        >
          検証
        </button>
        {vpVerified && <span className="text-blue-500">Done</span>}
      </div>
    </div>
  );
};

export default VPSubmitMain;
