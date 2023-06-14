# プロジェクト概要
　Issuerが本人資格情報(VC)を発行し、ウォレットへ本人資格情報を格納する。
　格納した本人資格情報を仮想空間サービス(メタバース)に提示し、メタバースが本人資格情報を検証する。

# 前提条件と本モジュールについて
　本実証実験では、KDDI社が保有する仮想空間サービスアセットとNRIデジタル社が保有するウォレットアセットを利用して実証実験を行った。
　本実証実験の納品物としての公開範囲は既存資産を除くため、本モジュールのみを公開範囲として提示する。
　本モジュールは、「Issuerが本人資格情報(VC)を発行するためのプロトタイプシステム」および「仮想空間サービスサービスで本人資格情報を検証するロジックを組み込むための元となるプロトタイプシステム」となる。
　実証再現を行うためには、別途「OpenID Connect for Verifiable Credential Issuance」および「Self-Issued OpenID Provider v2」に対応したウォレットと仮想空間サービスを用意する必要がある。
　その後、用意した仮想空間サービスに本人資格情報検証ロジックを組み込む必要がある。

# 動作環境
・DLTはIONを利用する。
・ミドルウェア
　ーNode.js 16.XX

# 本人資格情報の検証
src/views/verifier.ts

# フォルダ・ファイル構成
- `ejs`\
  各画面のテンプレート(HTML)
- `prisma`\
  Prisma(DB)関連
- `public/resources`\
  静的リソース
- `src/middlewares`\
  ログやエラーハンドリングのミドルウェア
- `src/views/functions.ts`\
  画面共通関数
- `src/views/index.ts`\
  トップ関連
- `src/views/issuer.ts`\
  Issuer関連
- `src/views/manage.ts`\
  Issuer/Verifier管理ページ関連
- `src/views/oidc.ts`\
  OIDC関連
- `src/views/tools.ts`\
  各種ツール
- `src/views/verifier.ts`\
  Verifier関連
- `src/common.ts`\
  共通部品
- `src/index.ts`\
  サーバー本体
- `src/router.ts`\
  ルーティング定義
- `src/socket.ts`\
  ソケット部品

  # 実行手順
  　本モジュールはIssuerからVC発行を行うことおよびVerifierがVC提示を受け入れることができるモジュールであり、1つのモジュールで構成されている。
  　本実行手順を行うことで、モジュールの立ち上げを行うことができ、モジュールが立ち上がるとIssuerおよびVerifier関連の機能の実行を行うことができる。
  　別途サーバを用意したのち、以下のコマンドを実行する。
  　ただし、NRIデジタル社が保有するウォレットアセットのライセンス購入を行いと実行は失敗する。
    yarn install
    yarn migrate
    yarn build
    yarn nodemon
    