import DidInfo from '@/components/DidInfo';
import BackButton from '@/components/BackButton';

import useVPSubmitMain from './useVPSubmitMain';

const VPSubmitMain = () => {
  const {
    vm,
    vpSubmitted,
    holderDidAccount,
    verifierDidAccount,
    issuerDidAccount,
    onVPSubmitClickHandler,
  } = useVPSubmitMain();

  return (
    <div>
      <div className="py-2">
        <BackButton url="./simple-demo" />
      </div>
      <p className="w-fit border-dashed border-4 p-4 mb-2">
        申請者が申請先に住民票VPを提出します。
      </p>
      <DidInfo name="申請者" didAccount={holderDidAccount} />
      <DidInfo name="申請先" didAccount={verifierDidAccount} />
      <DidInfo name="証明者" didAccount={issuerDidAccount} />

      <div className="pt-2">住民票VPの内容</div>
      <textarea value={vm} rows={26} cols={50} readOnly={true}></textarea>
      <div>
        <button
          onClick={onVPSubmitClickHandler}
          className="inline-block w-20 border-2 border-blue-500 hover:bg-blue-400 hover:text-white rounded-full text-center mr-4"
        >
          提出
        </button>
        {vpSubmitted && <span className="text-blue-500">Done</span>}
      </div>
    </div>
  );
};

export default VPSubmitMain;
