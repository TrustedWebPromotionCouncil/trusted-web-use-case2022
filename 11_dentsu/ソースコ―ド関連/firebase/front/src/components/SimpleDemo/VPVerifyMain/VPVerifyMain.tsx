import DidInfo from '@/components/DidInfo';
import BackButton from '@/components/BackButton';

import useVPVerifyMain from './useVPVerifyMain';

const VPSubmitMain = () => {
  const {
    vm,
    vpVerified,
    holderDidAccount,
    verifierDidAccount,
    issuerDidAccount,
    onVPVerifyClickHandler,
  } = useVPVerifyMain();

  return (
    <div>
      <div className="py-2">
        <BackButton url="./simple-demo" />
      </div>
      <p className="w-fit border-dashed border-4 p-4 mb-2">
        申請先が住民票VPを検証します。
      </p>
      <DidInfo name="申請先" didAccount={verifierDidAccount} />
      <DidInfo name="申請者" didAccount={holderDidAccount} />
      <DidInfo name="証明者" didAccount={issuerDidAccount} />

      <div className="pt-2">住民票VPの内容</div>
      <textarea value={vm} rows={26} cols={50} readOnly={true}></textarea>
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
