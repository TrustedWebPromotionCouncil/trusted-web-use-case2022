import DidInfo from '@/components/DidInfo';
import BackButton from '@/components/BackButton';
import useVCRequestMain from './useVCRequestMain';

const VCRequestMain = () => {
  const {
    vm,
    onVCRequestClickHandler,
    vcRequested,
    holderDidAccount,
    issuerDidAccount,
  } = useVCRequestMain();

  return (
    <div>
      <div className="py-2">
        <BackButton url="./simple-demo" />
      </div>
      <p className="w-fit border-dashed border-4 p-4 mb-2">
        申請者が証明者に住民票VCの発行を依頼します。
      </p>
      <DidInfo name="申請者" didAccount={holderDidAccount} />
      <DidInfo name="証明者" didAccount={issuerDidAccount} />

      <div className="pt-2">依頼内容</div>
      <textarea value={vm} rows={12} cols={50} readOnly={true}></textarea>
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
