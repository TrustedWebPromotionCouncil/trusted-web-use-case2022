import BackButton from '@/components/BackButton';

import StepStatus from './StepStatus';
import useMain from './useMain';

const Main = () => {
  const {
    accountsPrepared,
    vcRequested,
    vcIssued,
    vpSubmitted,
    vpVerified,
    onClearClickHandler,
    clearing,
  } = useMain();

  return (
    <div>
      <div className="py-2">
        <BackButton url="." />
      </div>
      <p className="w-fit border-dashed border-4 p-4">
        上から順番に実行しましょう。
        <br />
        各ステップを完了すると
        <span className="text-red-500">Not Yet</span>が
        <span className="text-blue-500">Done</span>に変わります。
        <br />
        各Stepを完了すると次のStepが実行できるようになります。
        <br />
        <br />
        Clearボタンをクリックすると初期状態に戻ります。
        <br />
        スマートコントラクトを削除するので、3秒ほどCleaing...状態になります。
      </p>
      <div className="mt-4 flex">
        {!clearing ? (
          <div className="w-56 border-2 border-blue-500 rounded-full text-center hover:bg-blue-400 hover:text-white">
            <a href="./simple-demo2-accounts">DIDの作成</a>
          </div>
        ) : (
          <div className="w-56 text-center">DID作成</div>
        )}
        <div className="w-56 text-center">申請者、証明者、申請先</div>
        <div className="w-20 text-center">
          <StepStatus done={accountsPrepared} />
        </div>
      </div>

      <div className="mt-4 flex">
        {!vcRequested && !clearing && accountsPrepared ? (
          <div className="w-56 border-2 border-blue-500 rounded-full text-center hover:bg-blue-400 hover:text-white">
            <a href="./simple-demo2-vcrequest">住民票VCの発行依頼</a>
          </div>
        ) : (
          <div className="w-56 text-center">住民票VCの発行依頼</div>
        )}
        <div className="w-56 text-center">申請者 -&gt; 証明者</div>
        <div className="w-20 text-center">
          <StepStatus done={vcRequested} />
        </div>
      </div>

      <div className="mt-4 flex">
        {vcRequested && !vcIssued ? (
          <div className="w-56 border-2 border-blue-500 rounded-full text-center hover:bg-blue-400 hover:text-white">
            <a href="./simple-demo2-vcissue">住民票VCの発行</a>
          </div>
        ) : (
          <div className="w-56 text-center">住民票VCの発行</div>
        )}
        <div className="w-56 text-center">証明者 -&gt; 申請者</div>
        <div className="w-20 text-center">
          <StepStatus done={vcIssued} />
        </div>
      </div>

      <div className="mt-4 flex">
        {vcIssued && !vpSubmitted ? (
          <div className="w-56 border-2 border-blue-500 rounded-full text-center hover:bg-blue-400 hover:text-white">
            <a href="./simple-demo2-vpsubmit">住民票VPの提出</a>
          </div>
        ) : (
          <div className="w-56 text-center">住民票VPの提出</div>
        )}
        <div className="w-56 text-center">申請者 -&gt; 申請先</div>
        <div className="w-20 text-center">
          <StepStatus done={vpSubmitted} />
        </div>
      </div>

      <div className="mt-4 flex">
        {vpSubmitted && !vpVerified ? (
          <div className="w-56 border-2 border-blue-500 rounded-full text-center hover:bg-blue-400 hover:text-white">
            <a href="./simple-demo2-vpverify">住民票VPの検証</a>
          </div>
        ) : (
          <div className="w-56 text-center">住民票VPの検証</div>
        )}
        <div className="w-56 text-center">申請先</div>
        <div className="w-20 text-center">
          <StepStatus done={vpVerified} />
        </div>
      </div>

      <div className="mt-4 flex">
        <button
          onClick={onClearClickHandler}
          className="inline-block w-20 border-2 border-blue-500 rounded-full text-center hover:bg-blue-400 hover:text-white mr-4"
        >
          Clear
        </button>
        {clearing && <span className="text-yellow-500">Clearing...</span>}
      </div>
    </div>
  );
};

export default Main;
