import DidInfo from '@/components/DidInfo';
import BackButton from '@/components/BackButton';

import useAccountsMain from './useAccountsMain';

const AccountsMain = () => {
  const {
    accountsPrepared,
    holderDidAccount,
    verifierDidAccount,
    issuerDidAccount,
    timestamp,
    onCreateAccountsHandler,
    onCheckBalanceHandler,
  } = useAccountsMain();

  return (
    <div>
      <div className="py-2">
        <BackButton url="./simple-demo" />
      </div>
      <p className="w-fit border-dashed border-4 p-4 mb-2">
        申請者DID、証明者DID、申請先DIDを作成します。
        <br />
        <br />
        証明者は、VC発行のときにスマートコントラクトを
        <br />
        作成するための手数料(0.001ALGO)を支払うので、
        <br />
        アカウントにALGOの残高が必要です。
        <br />
        <br />
        TestNetでは、
        <a
          target="_blank"
          className="text-blue-500 hover:bg-blue-400 hover:text-white"
          href="https://bank.testnet.algorand.network/"
          rel="noreferrer"
        >
          Algorand Dispenserのサイト
        </a>
        で、
        <br />
        ALGOを無料で取得できます。
        <br />
        <br />
        証明者アドレスをコピーしてください。
        <br />
        <br />
        <a
          target="_blank"
          className="text-blue-500 hover:bg-blue-400 hover:text-white"
          href="https://bank.testnet.algorand.network/"
          rel="noreferrer"
        >
          Algorand Dispenserのサイト
        </a>
        にアクセスし、
        <br />
        I&apos;m not a robootをチェックし、
        <br />
        target addressの入力エリアに先ほどコピーしたアドレスをペーストします。
        <br />
        Dispenseのボタンをクリックしてください。 <br />
        Status: Code 200 successのように表示されればOKです。
        <br />
        10 ALGO残高が増えているはずです。
        <br />
        <br />
        Webアプリに戻って残高チェックをしましょう。
        <br />
        <span className="text-red-500">NG</span>が
        <span className="text-blue-500">OK</span>
        に変わると次に進めます。
        <br />
        証明者のALGO残高は、最低1 ALGO必要です。
      </p>

      <DidInfo name="申請者" didAccount={holderDidAccount} />
      <DidInfo
        name="証明者"
        didAccount={issuerDidAccount}
        timestamp={timestamp}
      />
      <DidInfo name="申請先" didAccount={verifierDidAccount} />
      <div className="mt-4">
        証明者アドレス: {issuerDidAccount && issuerDidAccount.address}
      </div>
      <div>
        <a
          target="_blank"
          className="text-blue-500 hover:bg-blue-400 hover:text-white"
          href="https://bank.testnet.algorand.network/"
          rel="noreferrer"
        >
          Algorand Dispenserのサイト
        </a>
      </div>

      <div className="mt-8">
        <button
          onClick={onCreateAccountsHandler}
          className="inline-block w-28 border-2 border-blue-500 hover:bg-blue-400 hover:text-white rounded-full text-center mr-4"
        >
          DID作成
        </button>
        <button
          onClick={onCheckBalanceHandler}
          className="inline-block w-32 border-2 border-blue-500 hover:bg-blue-400 hover:text-white rounded-full text-center mr-4"
        >
          残高チェック
        </button>
        {accountsPrepared ? (
          <span className="text-blue-500">OK</span>
        ) : (
          <span className="text-red-500">NG</span>
        )}
      </div>
    </div>
  );
};

export default AccountsMain;
