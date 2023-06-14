# setup

## プロジェクト概要
> サイト閲覧者が自身のパーソナルデータを管理し、合意した範囲内で正しく利用されているかを追跡することでプライバシー保護を保護し、
> サイト運営者はOPを検証することにより、不正なアドテク事業者へのアクセスを除去して正確なデータを活用が可能となり、
> サイト閲覧者が自身をボットでないと証明することで、サイト運営者とアドテク事業者が不正なアクセスやアドフラウドを防止して正確なデータを活用することができるようになる。


## 必要リポジトリ
- 審査機関・非ボット認証機関・デモサイト
  - [datasign-inc/tw2022-web](https://github.com/datasign-inc/tw2022-web)
- DID発行CLIツール
  - [datasign-inc/tw2022-cli](https://github.com/datasign-inc/tw2022-cli)
- ブラウザエクステンション
  - [datasign-inc/tw2022-extension](https://github.com/datasign-inc/tw2022-extension)
- DWebNode
  - [datasign-inc/tw2022-dwn](https://github.com/datasign-inc/tw2022-dwn)

## 前提条件
審査機関・非ボット認証機関・デモサイトには***Google ReCAPTCHA用***のkeyが必要となります。
keyの取得、設定方法とOriginatorProfile審査機関情報の変更方法は[ドキュメント](https://github.com/datasign-inc/tw2022-web#readme)を確認してください。

## 登場人物

- サイト閲覧者(extension)
  - localhost:13000
- DWN
  - localhost:3000
- 組織認証機関
  - [http://localhost:3001](http://localhost:3001)
- 非ボット証明機関
  - [http://localhost:3001](http://localhost:3001)
- 認証済みメディアサイト
  - [http://example-1st-party1.com:9001](http://example-1st-party1.com:9001)
- アドテク事業者
  - [http://example-3rd-party1.com:9002](http://example-3rd-party1.com:9002)
- アクセス解析事業者
  - [http://example-3rd-party2.com:9003](http://example-3rd-party2.com:9003)
- 非認証メディアサイト
  - [http://example-1st-party2.com:9001](http://example-1st-party2.com:9001)

## /etc/hosts

```commandline
sudo vi /etc/hosts
```

add below

```text
127.0.0.1       example-1st-party1.com
127.0.0.1       example-3rd-party1.com
127.0.0.1       example-3rd-party2.com
127.0.0.1       example-1st-party2.com
127.0.0.1       opr.webdino.org
```

## node

```commandline
nvm install stable --latest-npm
nvm use 16
```

## dwn

### setup dwn & start

```bash
git clone git@github.com:datasign-inc/tw2022-dwn.git
cd tw2022-dwn
yarn && yarn build
yarn start
```

## cli tool

### setup cli tool

```bash
git clone git@github.com:datasign-inc/tw2022-cli.git
cd tw2022-cli
yarn install
```

### create did for sites

- example-1st-party1.com

```commandline
mkdir out
./bin/execute did createKeyPair --keyId key-1 --outputDir ./out/example-1st-party1.com
cp templateFiles/services_1st_1.json out/example-1st-party1.com
./bin/execute did generate --publicKeyPath ./out/example-1st-party1.com/key-1.publicKey.json --servicesPath ./out/example-1st-party1.com/services_1st_1.json --outputDir ./out/example-1st-party1.com
```

- example-3rd-party1.com

```bash
./bin/execute did createKeyPair --keyId key-1 --outputDir ./out/example-3rd-party1.com
cp templateFiles/services_3rd_1.json out/example-3rd-party1.com
./bin/execute did generate --publicKeyPath ./out/example-3rd-party1.com/key-1.publicKey.json --servicesPath ./out/example-3rd-party1.com/services_3rd_1.json --outputDir ./out/example-3rd-party1.com
```

- example-3rd-party2.com

```bash
./bin/execute did createKeyPair --keyId key-1 --outputDir ./out/example-3rd-party2.com
cp templateFiles/services_3rd_2.json out/example-3rd-party2.com
./bin/execute did generate --publicKeyPath ./out/example-3rd-party2.com/key-1.publicKey.json --servicesPath ./out/example-3rd-party2.com/services_3rd_2.json --outputDir ./out/example-3rd-party2.com
```

## 組織認証機関/非ボット証明機関/デモサイト

### clone

```bash
git clone git@github.com:datasign-inc/tw2022-web.git
```

### バックエンド

```bash
cd tw2022-web/backend
vi .env #中身は↓
yarn install
yarn start
```

- .env  
```text
DATABASE_FILEPATH=./database.sqlite
APP_PORT=3002
RE_CAPTCHA_VERIFY_SERVER_URL=https://www.google.com/recaptcha/api/siteverify
RE_CAPTCHA_SITE_KEY=
RE_CAPTCHA_SECRET=
CERTIFIER_INFO="{"url": "https://datasign.jp", "name": "株式会社DataSign", "postalCode": "160-0022", "addressCountry": "JP", "addressRegion": "東京都", "addressLocality": "新宿区", "streetAddress": "新宿6-7-22 エルプリメント新宿354号室"}"
OP_SIGN_KEY="[{"id":"key-1", "key" :"dvfzu_Nx2OB4iaVfdTpnG6Ct83dsLMSNGIFPVvKrnVM"}, {"id": "key-2","key":"dvfzu_Nx2OB4iaVfdTpnG6Ct83dsLMSNGIFPVvKrnVM"}]"
APP_SIGN_KEY=X_GaAfrCBtGs0adog3inf9Y9dientgJckNDRErDgr64
APP_SIGN_DID=did:ion:EiATEkNvHn-AVo2TV34JeUpaBfeK1CwHKlrT1u-2bP-Sbg:eyJkZWx0YSI6eyJwYXRjaGVzIjpbeyJhY3Rpb24iOiJyZXBsYWNlIiwiZG9jdW1lbnQiOnsicHVibGljS2V5cyI6W3siaWQiOiJrZXktMSIsInB1YmxpY0tleUp3ayI6eyJjcnYiOiJzZWNwMjU2azEiLCJrdHkiOiJFQyIsIngiOiJsVmFmc0lOWV9mcG40bnZqTURUbEtvckxBZzdvNkRsVnZTMW82Z2Jla3NRIiwieSI6IjlZTW1yNFctVUttR3F5YTl3Qi0zRXdNS3hhdVI2MUhxVjlpSWtQU25tbkkifSwicHVycG9zZXMiOlsiYXV0aGVudGljYXRpb24iXSwidHlwZSI6Ikpzb25XZWJLZXkyMDIwIn1dLCJzZXJ2aWNlcyI6W3siaWQiOiJkd24iLCJzZXJ2aWNlRW5kcG9pbnQiOnsibm9kZXMiOlsiaHR0cDovL2xvY2FsaG9zdDozMDAwIl19LCJ0eXBlIjoiRGVjZW50cmFsaXplZFdlYk5vZGUifV19fV0sInVwZGF0ZUNvbW1pdG1lbnQiOiJFaUJGd19HRXpPQm55ZDdCZ0FBYWlCNXJPNHgtcEZYNmJzOWNCSjRDQ1V3RTB3In0sInN1ZmZpeERhdGEiOnsiZGVsdGFIYXNoIjoiRWlEeGd2ZHkzVFhYTDlrM0luV2tyZ2tnQWMxYy1KV3ZsQktUTDhzN09WRkFqZyIsInJlY292ZXJ5Q29tbWl0bWVudCI6IkVpQ2J5OUI2WEs4TzU1dk1KSTJaTFE2aG1ENWtESW11RW9NdHBpQ2hESFVrUUEifX0
```
[RE_CAPTCHA_SITE_KEYとRE_CAPTCHA_SECRETの作成方法](https://github.com/datasign-inc/tw2022-web#readme)

### フロントエンド

```bash
cd tw2022-web/frontend
vi .env #中身は↓
yarn && yarn build
yarn start
```

- .env  
```text
PORT=3001
REACT_APP_RECAPTCHA_SITE_KEY=
```
[REACT_APP_RECAPTCHA_SITE_KEYの作成方法](https://github.com/datasign-inc/tw2022-web#readme)

### デモサイト

```bash
cd tw2022-web/demo
mkdir -p output/{example-1st-party1.com,example-1st-party2.com,example-3rd-party1.com,example-3rd-party2.com}
```

- copy did and template html

```bash
cp tw2022-cli/out/example-1st-party1.com/did.json tw2022-web/demo/output/example-1st-party1.com
cp tw2022-cli/out/example-3rd-party1.com/did.json tw2022-web/demo/output/example-3rd-party1.com
cp tw2022-cli/out/example-3rd-party2.com/did.json tw2022-web/demo/output/example-3rd-party2.com
cp tw2022-web/demo/templateFiles/1st_1_index.html tw2022-web/demo/output/example-1st-party1.com/index.html
cp tw2022-web/demo/templateFiles/1st_2_index.html tw2022-web/demo/output/example-1st-party2.com/index.html
```

- install and start server

```bash
cd tw2022-web/demo
yarn && yarn build
yarn start
```

### op 生成

1. 新規 OP 発行
   - http://localhost:3001/vc/new

- メディアサイト(example-1st-party1.com)

```text
URL
http://example-1st-party1.com:9001/
企業名 Media Inc.
郵便番号 000-0000
国名 JP
都道府県 Tokyo
市区町村 Shibuya
番地 0-0-0
カテゴリー -> ③広告販売者 -> 媒体事業者
```

- 広告事業者(example-3rd-party1.com)

```text
URL
http://example-3rd-party1.com:9002/
企業名 AdTech Inc.
郵便番号 000-0000
国名 JP
都道府県 Tokyo
市区町村 Shibuya
番地 0-0-0
カテゴリー -> ②広告取引仲介事業者 -> DSP事業者
```

- アクセス解析事業者(example-3rd-party2.com)

```text
URL
http://example-3rd-party2.com:9003/
企業名 Analytics Inc.
郵便番号 000-0000
国名 JP
都道府県 Tokyo
市区町村 Shibuya
番地 0-0-0
カテゴリー -> ⑤アクセス解析 -> アクセス解析事業者
```

1. profile set 生成(op-document)
   - http://localhost:3001/vc/list

```bash
vi tw2022-web/demo/output/example-1st-party1.com/op-document
```

```json
{
  "@context": "https://oprdev.herokuapp.com/context",
  "publisher": ["http://example-1st-party1.com:9001/"],
  "advertiser": [
    "http://example-3rd-party1.com:9002/",
    "http://example-3rd-party2.com:9003/"
  ],
  "profile": [
    "example-1st-party1.comのJWT",
    "example-3rd-party1.comのJWT",
    "example-3rd-party2.comのJWT"
  ]
}
```

## エクステンション

### エクステンションセットアップ

- clone

```bash
git clone git@github.com:datasign-inc/tw2022-extension.git
```

- 別ターミナルで(3 つ)

```bash
cd tw2022-extension
yarn install
yarn start
```


```bash
cd tw2022-extension/bundles
yarn install
yarn dev
```

```bash
cd tw2022-extension/content_script
yarn install
yarn dev
```

### エクステンションインストール

- chrome -> その他ツール -> 機能拡張
- パッケージ化されていない拡張機能を読み込む
  - tw2022-extension/dist を選択