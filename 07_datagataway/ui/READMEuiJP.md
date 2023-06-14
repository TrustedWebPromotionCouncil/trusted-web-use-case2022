# Woollet カーボントレーシングプロジェクトの管理者システム

## **説明**

カーボントレーシング管理者用の UI ウェブアプリケーションです。

これは主に[Next.js](https://urldefense.com/v3/__https://nextjs.org/)**T__;44OX44Ot44K444Kn44Kv44OI44Gn!!GCTRfqYYOYGmgK_z!509Ld1Mwvz_YXX0WV7naoVN-cLT-Qg-LBrqvIC-QZXY67ImyJwhxV0ylT6PtppFutXLH-NydxR62v-UFg__rzTtHZpZ4PdvjNJmTMp6f6Q$ 、[`create-next-app`](https://urldefense.com/v3/__https://github.com/vercel/next.js/tree/canary/packages/create-next-app)**i__;44KS5L2_55So44GX44Gm5L2c5oiQ44GV44KM44G-44GX44Gf!!GCTRfqYYOYGmgK_z!509Ld1Mwvz_YXX0WV7naoVN-cLT-Qg-LBrqvIC-QZXY67ImyJwhxV0ylT6PtppFutXLH-NydxR62v-UFg__rzTtHZpZ4PdvjNJm8Fms3kQ$ 。

## **機能**

管理者 UI システムは、以下の機能を持っています（他の機能も含む）：

-   実際のデータパターンに合ったスキーマとエンベロープスキーマの管理、精密なターゲティングクエリのための分割
-   発行および検証リクエストのログの保存
-   企業のプロファイルの管理（主に報告目的）
-   サプライチェーンパートナーの管理者サインイン/サインアウト
-   生データクレデンシャルの報告
-   接続の管理
-   組織とサプライチェーンパートナーのスタッフの管理
-   スタッフまたはパートナーシップの役割に応じたデータのリクエストと表示

## **要件**

-   NodeJS >= 18.16

以下の主要なライブラリは、以下の`npm install`コマンドで自動的にインストールされます：

-   React >= 18.2
-   NextJS >= 13.0.5
-   Bootstrap >= 5.2.3
-   Chart.js >= 4.2.1
-   React-chartjs-2 >= 5.2.0
-   Datatables.net >= 1.13.1
-   Next-qrcode >= 2.4.0
-   Socket.io-client >= 4.5.4

## **実行方法**

まず、必要なライブラリをインストールします：

```bash
npm install
```

次に、開発サーバーを実行します：

```bash
npm run start
```

または

```bash
yarn start
```

ブラウザで[https://urldefense.com/v3/__http://localhost:3000*(http:/*localhost:3000)**r__;XS_jgavjgqLjgq_jgrvjgrnjgZfjgabntZDmnpzjgpLnorroqo3jgZfjgb7jgZk!!GCTRfqYYOYGmgK_z!509Ld1Mwvz_YXX0WV7naoVN-cLT-Qg-LBrqvIC-QZXY67ImyJwhxV0ylT6PtppFutXLH-NydxR62v-UFg__rzTtHZpZ4PdvjNJkDEQA5ew$ 。

## **ディレクトリ構造**

### `/components`

---

-   ページのレンダリングに使用される主要な UI コンポーネント：
    -   メインメニュー：
        -   `Navbar.js`

### `/data`

---

-   Woollet API コネクタ
    -   `did.js`
-   ソケット操作
    -   `socket.js`
-   テーブルのレンダリングライブラリ
    -   `woollet.js`

### `/pages`

---

-   ## `/api`

前処理とデータ処理関数のための API のローカルラッパー
`/conn`：接続の管理
`/data`：データの処理の要求
`/wallet`：レビュー用のデータクレデンシャルのリスト
`/ipfs`：Woollet のプライベート IPFS からのデータコンテンツの取得（TEE を介した操作）
`/issues`：VC 発行のログ
`/verify`：プレゼンテーションリクエストの処理
`/envelope`：データエンベロープとメタデータのメンテナンス

-   `/supplychain`
    -   管理者による新しいパートナー（組織）の作成
    -   主要なサプライチェーンパートナーとそのスタッフのメンテナンス
    -   新しいスタッフメンバーへのリンク
    -   パートナーのスタッフログイン
-   `/data`
    -   スタッフメンバーによるデータの要求
    -   スタッフメンバーによるデータの表示
-   `/system`
    -   現在の組織の主要な設定とステータス
    -   スキーマのメンテナンス（データエンベロープとアイデンティティスキーマを含む）
    -   ウォレットのコンテンツ（主にデータクレデンシャルのリスト）
