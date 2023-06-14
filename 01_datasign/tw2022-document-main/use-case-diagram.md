[TOC]

---

# Actor

- プロトタイプ運営
- サイト閲覧者
- 審査機関
- サイト運営社
- アドテク事業者

---

# USECASE

## 1. 企業 DID 発行

下記企業の DID を予め発行しておく

- 審査機関
- サイト運営社
- アドテク事業者

DID document の services に DWeb Node の URL を指定する

```json
{
  "id": "did:example:123",
  "service": [
    {
      "id": "#dwn",
      "type": "DecentralizedWebNode",
      "serviceEndpoint": {
        "nodes": ["https://dwn.example.com", "https://example.org/dwn"]
      }
    }
  ]
}
```

```puml
@startuml
actor ac_datasign as "プロトタイプ運営"

rectangle "ion-cli" as cli {
  usecase "企業のDID発行" as uc_issue_did

  note right of uc_issue_did: servicesにDWeb Node\nのURLを指定する
}
rectangle "ION" as ion {
  usecase "DID document作成" as uc_operate_did_document
  usecase "hosting DID document" as uc_hosting_did
}

ac_datasign -- uc_issue_did
  uc_issue_did ..> uc_operate_did_document
  uc_operate_did_document .> uc_hosting_did

@enduml
```

## 2. 組織正当性証明 OP(審査機関担当者)

### OP 登録

以下を参照して `businessCategory` を定義する
https://www.jicdaq.or.jp/files/dl/dl_005.pdf

```puml
@startuml
actor ac_company as "企業担当者"
actor ac_authority as "審査機関担当者"

usecase "企業情報" as uc_company_info

rectangle "審査機関" as authority {
  usecase "企業情報入力" as uc_input_company_info
}
database "DataBase" as database {
  usecase "Profile保存" as uc_save_prifile
}

ac_company --> uc_company_info
note left
    - サービス名
    - URL
    - 郵便番号
    - 住所(国名)
    - 住所(都道府県)
    - 住所(市区町村)
    - 住所(番地号)
    - 事業領域
    - 有効期限
end note

uc_company_info --> ac_authority:登録申請
ac_authority --> uc_input_company_info
  uc_input_company_info ..> uc_save_prifile

@enduml
```

### Profile Set 登録

```puml
@startuml
actor ac_media as "サイト運営者"

rectangle "審査機関" as authority {
  usecase "発行済みOPリスト表示" as uc_show_op_list
  note left
      - サービス名
      - URL
      - 発行日
      - 有効期限
      - 有効期限
  end note
}

cloud "ウェブサイト" as website {
  file "/.well-known/op-document" as op_document

}
usecase "Profile Set 作成" as uc_create_profile_set
note bottom
{
  "@context": "https://xxx~",
  "publisher": ["https://publisher.com"],
  "advertiser": [
    "https://advertiser.com",
    ...
     ],
  "profile": [
    "endodedJwt",
    ...
      ]
}
end note

ac_media <-- uc_show_op_list:op 取得
ac_media <--> uc_create_profile_set
uc_create_profile_set ..> op_document: Profile Set 設置

@enduml

```

---

## 3. セットアップ(サイト閲覧者)

サイト閲覧者はエクステンションで新規に自身の DID を発行する

```puml
@startuml
left to right direction

actor ac_consumer as "サイト閲覧者"

rectangle "エクステンション" as extension {
  rectangle popup {
    usecase "パスワード登録" as uc1
    usecase "キーペア生成" as uc_gen_key_pair
    usecase "公開鍵アップロード" as uc_publish_public_key
    note bottom of uc1: キーペア生成
  }
}
rectangle "ION" as ion {
  usecase uc_issue_did as "DID発行"
  usecase uc_operate_did_document as "DID document操作"
  rectangle "IPFS" as ipfs {
    usecase uc_hosting_did as "hosting DID document"
  }
}

ac_consumer -- uc1
  uc1 ..> uc_gen_key_pair
  uc1 ..> uc_publish_public_key
  uc1 ..> uc_issue_did
  uc_publish_public_key ..> uc_operate_did_document
  uc_operate_did_document ..> uc_hosting_did

@enduml
```

---

## 4. 非 Bot 証明

```puml
@startuml

actor ac_consumer as "サイト閲覧者"
left to right direction

rectangle "審査機関" as site_authority {
  usecase "1. reCAPTCHA表示" as uc_show_captcha
  usecase "2. BOTじゃない確認" as uc_confirm_not_bot
  usecase "3. 拡張機能へリダイレクト" as uc_redirect_consumer_to_extension
  usecase "6. レスポンス検証" as uc_verify_siop_response
  usecase "7. 非Bot DID登録" as uc_issure_vc

  note bottom of uc_redirect_consumer_to_extension: 署名してもらうチャレンジを送付
}

rectangle "エクステンション" as extension {
  rectangle tab {
    usecase "4. ロック解除\n(password入力) " as uc_unlock
    usecase "5. チャレンジに署名して\nリダイレクト" as uc_authz

    note bottom of uc_authz: /?did=did:xxx:123&sig=xxx
  }
}

uc_show_captcha ..> uc_confirm_not_bot
ac_consumer -- uc_confirm_not_bot
  uc_confirm_not_bot ..> uc_redirect_consumer_to_extension
ac_consumer -- uc_unlock
  uc_unlock .> uc_authz
  uc_authz ..> uc_verify_siop_response
  uc_verify_siop_response ..> uc_issure_vc
@enduml
```

非 BotVC をこの時点で発行してしまうと、ペアワイズ DID と大元の DID の関係が隠せないため名寄せなどへの対策とならない。

VC 発行時点

```puml
@startuml
actor ac1 as "サイト閲覧者"
actor ac0 as "審査期間"
file vc as "非BotVC"

vc -up-> ac1: as subject
vc -up-> ac0: as issure
@enduml
```

VC 送信時点

```puml
@startuml
actor ac1 as "サイト閲覧者"
actor ac2 as "分身(ペアワイズDID)"
actor ac0 as "審査期間"
file vc as "非BotVC"

vc -up-> ac1: as subject
vc -up-> ac2: as holder
vc -up-> ac0: as issure
@enduml
```

これを防ぐために、

1. 非 Bot 証明を実行した時点では、審査期間の内部のシステムに証明ずみの ID として登録しておき、
2. サイト閲覧時のペアワイズ DID を生成したタイミングで当該の DID を subject として発行する

という段階的な手順で非 BotVC を発行する方式を採用する。

Claim イメージ

```json
{
  "credentialSubject": {
    "id": "did:xxx:123",
    "isBot": false
  }
}
```

---

## 5. サイト閲覧

### 5.1 組織正当性検証

```puml
@startuml
left to right direction

actor ac_consumer as "サイト閲覧者"

rectangle "メディアサイトA" as site_medhia_a {
  usecase "ドメイン対応DID表示" as uc_respond_did

  note bottom of uc_respond_did: /.well-known/did でdidを返却する
}

rectangle "アドテク事業者サイトA" as site_ad_a {
  usecase "ドメイン対応DID表示" as uc_respond_did2

  note bottom of uc_respond_did2: /.well-known/did でdidを返却する
}

rectangle "エクステンション" as extension {
  rectangle service_worker {
    usecase "0. 通信ブロック" as uc_block_network_request
    usecase "1. 閲覧サイト検証" as uc_start_site_verification
    usecase "1.1. 検証対象DID取得" as uc_get_verification_target_did
    usecase "1.2. 組織正当性検証" as uc_verify_vc_as_valid_org1

    note top of uc_verify_vc_as_valid_org1: DID documentのservicesに\nDWeb NodeのURLが入っている
  }
  rectangle popup {
    usecase "2. 組織正当性検証結果表示" as uc_show_verification_result
  }
}

rectangle "DWeb Node" as webstorage {
  usecase "VCレスポンス" as uc_respond_vc
}
note bottom of webstorage:  https://localhost:8000/

uc_start_site_verification ..> uc_get_verification_target_did
  uc_get_verification_target_did ..> uc_respond_did
  uc_get_verification_target_did ..> uc_respond_did2
uc_start_site_verification ..> uc_verify_vc_as_valid_org1
  uc_verify_vc_as_valid_org1 ..> uc_respond_vc
ac_consumer -- uc_show_verification_result
@enduml
```

メモ

- 組織正当性検証
  - https://<<通信が発生したドメイン>>/.well-knowned/did で did を取得する

### 5.2. データ提供

組織正当性検証が全て成功している場合はデータ送信を自動的に行う

#### 自動提供

```puml
@startuml
left to right direction

rectangle "エクステンション" as extension {
  rectangle service_worker {
    usecase "提供データ自動生成" as uc_auto_create_data
  }
  usecase "1. DID発行" as uc_issue_new_did
  usecase "2. 広告識別子発行" as uc_issue_new_ad_id
  usecase "3. 利用範囲情報生成" as uc_generate_use_range
  usecase "4. データ提供実行" as uc_send_data
}

rectangle "DWeb Node" as webstorage {
  rectangle "閲覧者" as node1 {
    usecase "アクセス権付与" as uc_grant_permission_to_site
    usecase "VC保存" as uc_save_vc
    note bottom of uc_grant_permission_to_site: grandBy/grantToを指定
  }
}
note bottom of webstorage:  https://localhost:8000/

uc_auto_create_data ..> uc_issue_new_did
uc_auto_create_data ..> uc_issue_new_ad_id
uc_auto_create_data ..> uc_generate_use_range
uc_auto_create_data ..> uc_send_data

uc_send_data ..> uc_save_vc
uc_send_data ..> uc_grant_permission_to_site
@enduml
```

#### 手動提供

メールアドレス及び、組織正当性検証が失敗している場合はデータ送信を手動で行うことができる
※ メールアドレスの提供とその他データの提供を別操作とするかは要検討

メールアドレスを取得したい場合はそのサイト内の HTML にメタタグで目印をつけて置ける想定
ポップアップでメールアドレスを要求する旨をユーザーに伝える
自動的に送信するデータ項目はパーミッションとしてあらかじめ設定して置けると良い

```puml
@startuml
left to right direction

actor ac_consumer as "サイト閲覧者"

rectangle "エクステンション" as extension {
  rectangle popup {
    usecase "閲覧サイト検証結果表示" as uc_verify_site
    usecase "データ提供" as uc_request_send_data
    usecase "ドメイン毎設定編集" as uc_edit_setting_by_domain
    usecase "ロック解除\n(password入力) " as uc_unlock
    usecase "メールアドレス生成" as uc_input_new_email
    usecase "メールアドレス提供" as uc_send_new_email
    usecase "利用範囲情報生成" as uc_generate_use_range

    note top of uc_request_send_data: 自DIDをクエリ文字列で指定して\n表示中のタブをリロード
  }
  usecase "DID発行" as uc_issue_new_did
  usecase "広告識別子発行" as uc_issue_new_ad_id
  usecase "データ提供実行" as uc_send_data
}

rectangle "DWeb Node" as webstorage {
  rectangle "閲覧者" as node1 {
    usecase "アクセス権付与" as uc_grant_permission_to_site
    usecase "VC保存" as uc_save_vc
    note bottom of uc_grant_permission_to_site: grandBy/grantToを指定
  }
}
note bottom of webstorage:  https://localhost:8000/


ac_consumer -- uc_verify_site
  uc_verify_site ..> uc_issue_new_did
  uc_verify_site ..> uc_input_new_email
  uc_verify_site ..> uc_send_new_email
  uc_verify_site ..> uc_edit_setting_by_domain
  uc_verify_site ..> uc_request_send_data
    uc_request_send_data ..> uc_send_data
  uc_verify_site ..> uc_send_new_email
    uc_send_new_email ..> uc_send_data
ac_consumer -- uc_edit_setting_by_domain
  uc_edit_setting_by_domain ..> uc_issue_new_ad_id
  uc_edit_setting_by_domain ..> uc_generate_use_range
ac_consumer -- uc_send_data
  uc_send_data ..> uc_save_vc
  uc_send_data ..> uc_grant_permission_to_site
ac_consumer -- uc_unlock
@enduml
```

メモ

- 広告識別子
  - 閲覧ドメイン横断のアド ID(日経と朝日のサイトで google は同じ広告 ID を使える)
  - そのサイトの 3rd パーティ cookie が使えなくなることを想定して「使って良いよ」ID を DWebNode に書き込んでおく
  - 閲覧者の DID は 1st パーティ毎に発行する
  - revoke はできる必要がある

渡すデータ

- パーソナルデータは subject と issure が同じ
- 利用範囲
  webtru のドメイン毎の ON/OFF 情報に相当するデータ
- 非 Bot 証明 VC

### 5.3. 閲覧者正当性検証

サイト閲覧者がデータ送信(発行した DID を URL に付与してサイトをリロード)して始まるユースケース

```puml
@startuml

rectangle "メディアサイトA" as site_medhia_a {
  usecase "1. 閲覧者正当性確認" as uc_verify_siop_response
  usecase "1.1. 非Bot証明VC\n検証" as uc_verify_vc
  usecase "1.2. パーソナルデータ取得" as uc_get_personal_data
  usecase "1.3. 外部ドメイン通信にdidを伝達" as uc_notice_did_to_external_site

  note top of uc_verify_siop_response: didが指定されていたら\n閲覧者のDIDと見なす
  note top of uc_get_personal_data: 利用範囲を取得する
  note top of uc_notice_did_to_external_site: 利用範囲で許可されたドメインに\ndidをクエリ文字列に付加して再通信
}
rectangle "アドテク事業者サーバーA" as site_medhia_b {
  usecase "1. 非Bot証明VC\n検証" as uc_verify_vc2
  usecase "2. パーソナルデータ取得" as uc_get_personal_data2
}

rectangle "DWeb Node" as webstorage {
  rectangle "閲覧者ノード" as node3 {
    usecase "認証" as uc_auth_grant_to
    usecase "非Bot証明VC\nレスポンス" as uc_respond_vc
    usecase "パーソナルデータVC\nレスポンス" as uc_respond_personal_vc
    usecase "アクセスログ記録" as uc_log_access_history
  }
  note bottom of uc_auth_grant_to: 署名してもらうチャレンジを送付
}
note bottom of webstorage:  https://localhost:8000/

uc_verify_siop_response ..> uc_verify_vc
  uc_verify_vc ..> uc_respond_vc
    uc_respond_vc ..> uc_auth_grant_to
uc_verify_siop_response ..> uc_get_personal_data
  uc_get_personal_data ..> uc_respond_personal_vc
  uc_respond_personal_vc ..> uc_auth_grant_to
    uc_respond_personal_vc ..> uc_log_access_history
uc_verify_siop_response ..> uc_notice_did_to_external_site
  uc_notice_did_to_external_site ..> uc_verify_vc2
    uc_verify_vc2 ..> uc_respond_vc
uc_verify_vc2 ..> uc_get_personal_data2
  uc_get_personal_data2 ..> uc_respond_personal_vc
@enduml
```

企業の秘密鍵をデモアプリに設定する手段は要検討
タイミング的にサイト閲覧者が操作しているタイミングなので、前回プロトの時の企業担当者のエクステンションで操作する想定は成立しない

## 6. 提供データ管理

無効化の実現手段は検討中

```puml
@startuml
left to right direction

actor ac_consumer as "サイト閲覧者"

rectangle "エクステンション" as extension {
  rectangle popup {
    usecase "パーソナルデータ\nアクセス履歴表示" as uc_show_access_log
    usecase "パーソナルデータ\n無効化" as uc_revoke_personal_data
    usecase "ロック解除\n(password入力) " as uc_unlock
  }
}

rectangle "DWeb Node" as webstorage {
  rectangle "閲覧者" as node1 {
    usecase "アクセスログ\nレスポンス" as uc_grant_permission_to_site
  }
}


ac_consumer -- uc_unlock
@enduml
```

---

# Data Structure

```puml
@startuml

object "did1" as did1 {
  value = "did:xxx:123"
}
object "did2" as did2 {
  value = "did:xxx:456"
}
object "email" as email1 {
  visitor = "<did of did1>"
  value = "xxx@bunsin.io"
}
object "email" as email2 {
  visitor = "<did of did2>"
  value = "yyy@bunsin.io"
}
object "first_party" as first_party1 {
  id = "<did of first_party1>"
  visitor = "<did of did1>"
  value = "nikkei.jp"
}
object "first_party" as first_party2 {
  id = "<did of first_party2>"
  visitor = "<did of did2>"
  value = "asahi.jp"
}
object "domain1" as domain1 {
  id = "<did of domain1>"
  value = "google.com"
}
object "domain2" as domain2 {
  id = "<did of domain2>"
  value = "line.jp"
}
object "ad_id" as ad_id1_1 {
  first_party = "<did of first_party1>"
  domains = "<did of domain1>
}
object "ad_id" as ad_id1_2 {
  first_party = "<did of first_party1>"
  domains = "<did of domain2>
}
object "ad_id" as ad_id2_1 {
  first_party = "<did of first_party2>"
  domains = "<did of domain1>"
}
object "ad_id" as ad_id2_2 {
  first_party = "<did of first_party2>"
  domains = "<did of domain2>"
}
object "ad_id_value" as ad_id_value_1 {
  value = "12345"
}
object "ad_id_value" as ad_id_value_2 {
  value = "67890"
}

did1 -up-o email1
did2 -up-o email2

did1 --o ad_id1_1
did1 --o ad_id1_2
did2 --o ad_id2_1
did2 --o ad_id2_2

first_party1 --o ad_id1_1
first_party1 --o ad_id1_2
first_party2 --o ad_id2_1
first_party2 --o ad_id2_2

domain1 --o ad_id1_1
domain2 --o ad_id1_2

domain1 --o ad_id2_1
domain2 --o ad_id2_2

ad_id_value_1 -up-o ad_id1_1
ad_id_value_1 -up-o ad_id2_1

ad_id_value_2 -up-o ad_id1_2
ad_id_value_2 -up-o ad_id2_2

did1 --o first_party1
did2 --o first_party2

@enduml
```

## 閲覧者のテータ提供履歴情報

提供するデータではなく、過去に提供したデータの履歴情報も自身のノードに保存する
この場合の DWebNode の持ち主は RootDID

- dids
- emails
- first_parties
- domains
- ad_ids
- ad_id_values
- term_of_uses

## パーソナルデータ(広告 ID/利用範囲)

Nikkei のサイトで Google に広告 ID を渡す

- CollectionsWrite

```json
{
  "data": {
    "ad_id": 12345,
    "term_of_use": {}
  },
  "descriptor": { // Message Descriptor
    "nonce": "9b9c7f1fcabfc471ee2682890b58a427ba2c8db59ddf3c2d5ad16ccc84bb3106",
    "recordId": "b6464162-84af-4aab-aff5-f1f8438dfc1e",
    "dataCid": CID(data),
    "dateCreated": 123456789,
    "published": false,
    "method": "CollectionsWrite",
    "schema": "https://schema.org/SocialMediaPosting",
    "dataFormat": DATA_FORMAT
  }
}
```

- Permissoin

```json
{
  "descriptor": {
    "method": "PermissionsGrant",
    "nonce": "9b9c7f1fcabfc471ee2682890b58a427ba2c8db59ddf3c2d5ad16ccc84bb3106",
    "permissionGrantId": "f45wve-5b56v5w-5657b4e-56gqf35v",
    "permissionRequestId": "b6464162-84af-4aab-aff5-f1f8438dfc1e",
    "grantedBy": "did:xxx:123",
    "grantedTo": "<did of domain1>",
    "expiry": 1575606941,
    "delegatedFrom": PARENT_PERMISSION_GRANT,
    "scope": {
      "method": "CollectionsRead",
      "schema": "https://schema.org/MusicPlaylist",
      "recordId": "b6464162-84af-4aab-aff5-f1f8438dfc1e"
    },
}
```

Nikkei のサイトで Line に広告 ID を渡す

- CollectionsWrite

```json
{
  "data": {
    "ad_id": 67890,
    "term_of_use": {}
  },
  "descriptor": { // Message Descriptor
    "nonce": "9b9c7f1fcabfc471ee2682890b58a427ba2c8db59ddf3c2d5ad16ccc84bb3106",
    "recordId": "b6464162-84af-4aab-aff5-f1f8438dfc1e",
    "dataCid": CID(data),
    "dateCreated": 123456789,
    "published": false,
    "method": "CollectionsWrite",
    "schema": "https://schema.org/SocialMediaPosting",
    "dataFormat": DATA_FORMAT
  }
}
```

- Permissoin

```json
{
  "descriptor": {
    "method": "PermissionsGrant",
    "nonce": "9b9c7f1fcabfc471ee2682890b58a427ba2c8db59ddf3c2d5ad16ccc84bb3106",
    "permissionGrantId": "f45wve-5b56v5w-5657b4e-56gqf35v",
    "permissionRequestId": "b6464162-84af-4aab-aff5-f1f8438dfc1e",
    "grantedBy": "did:xxx:123",
    "grantedTo": "<did of domain2>",
    "expiry": 1575606941,
    "delegatedFrom": PARENT_PERMISSION_GRANT,
    "scope": {
      "method": "CollectionsRead",
      "schema": "https://schema.org/MusicPlaylist",
      "recordId": "b6464162-84af-4aab-aff5-f1f8438dfc1e"
    },
}
```

## パーソナルデータ(メールアドレス)

別のサイトを閲覧した場合にすでに広告 ID を提供済みのドメインだった場合は同じ ID を提供する、ので提供済みドメインと DID の関連も親玉 DID の DWeb Node に保存しておく

広告 ID から名寄せできてしまうのでは？★

---

# Wireframe

## サイト閲覧者用エクステンション

ページ階層

```puml
@startsalt
scale 2
{
{T
 + ポップアップメニュー
 ++ 閲覧サイト検証結果
 +++ ドメイン毎設定編集
 ++ パーソナルデータ提供状態(全ドメイン)
 ++ ロック解除
}
}
@endsalt
```

### ポップアップメニュー

```puml
@startsalt
scale 1.5
{+
  --
  <&person> did:xxx:123
  --
  閲覧サイト検証結果 >
  --
  パーソナルデータアクセス履歴 >
  --
}
@endsalt
```

### 閲覧サイト検証結果

All OK

```puml
@startsalt
scale 1.5
{+
  --
    < Back
  --
  did:xxx:123
  --
  {^"メールアドレス"
    "Input mail address"
    [new mail address]
  }
  --
  <&circle-check> www.nikkei.com >
  [X] 送信対象
  --
  <&circle-check>  google.com <&external-link> >
  [X] 送信対象
  --
  <&circle-check> line.jp <&external-link> >
  [X] 送信対象
  --
  [send data]
  [revoke data]
}
@endsalt
```

NG あり

```puml
@startsalt
scale 1.5
{+
  --
    < Back
  --
  <DID not set>
  --
  {^"メールアドレス"
    "Input mail address"
    [save mail address]
  }
  --
  <&circle-x> www.nikkei.com >
  [] 送信対象
  --
  <&circle-check>  google.com <&external-link> >
  [X] 送信対象
  --
  <&circle-check> line.jp <&external-link> >
  [X] 送信対象
  --
  [send data]
}
@endsalt
```

- NG がある場合は DID は未発行(`send data`時に自動的に生成する)
- 外部リンクアイコンは通信先ドメイン
- `send data`を実行すると閲覧者の DWebNode にデータを送って閲覧中サイトに DID を付与してリロード

### ドメイン毎設定内容

1st party domain

```puml
@startsalt
scale 1.5
{+
  --
    < Back
  --
  <&circle-check> www.nikkei.com
  --
  <generated ad-id>
  --
  {^"利用範囲"
    [X] 広告
    [X] アクセス解析
  }
  --
  [save]
}
@endsalt
```

3rd party domain

```puml
@startsalt
scale 1.5
{+
  --
    < Back
  --
  <&circle-check> google.com
  --
  <generated ad-id>
  --
  {^"利用範囲"
    [X] 広告
    [X] アクセス解析
  }
  --
  [save]
}
@endsalt
```

### パーソナルデータアクセス履歴

```puml
@startsalt
scale 1.5
{+
  --
    < Back
  --
  アクセス元: www.nikkei.com
  日時: 2022年9月29日
  対象: 広告ID/利用範囲
  --
  アクセス元: google.com
  日時: 2022年9月29日
  対象: 広告ID/利用範囲
  --
  アクセス元: line.jp
  日時: 2022年9月29日
  対象: 広告ID/利用範囲
  --
  アクセス元: www.nikkei.com
  日時: 2022年9月29日
  対象: メールアドレス
  --
}
@endsalt
```

---

# 開発アイテム

## 企業 DID 発行ツール

- 概要
  企業の DID を発行する CLI ツール
- 要件
  - 企業の DID を発行
    - DWebNode の URL を指定できる
  - 企業の DID を更新
- 構成
  - nodejs
  - ion-tool

## 組織正当性証明 OP 発行サイト

- 概要
  メディアサイト、アドテク事業者サイト用の正当性証明 OP を発行する web サイト
- 要件
  - Originator Profile に必要な情報を profile として登録することができる
  - 登録した profile の一覧を表示することができる
  - 登録した profile から jwt 形式の OP を表示することができる
- 構成

  - nodejs
  - react

- 備考
  profile に必要な情報は Originator Profile の必須項目に以下の 2 項目を追加

  - 事業領域
  - 有効期限

  ## 非 Bot 証明発行アプリ

- 概要
  reCAPTCHA 系の仕組みを利用して Bot ではなく人間が操作した証明を VC として発行する web アプリ(実装範囲は要確認)
- 要件
  - reCAPTCHA 表示ができる(要スコープ確認)
  - 対象の DID を認証するチャレンジ生成(要スコープ確認)
  - 対象の DID を認証するチャレンジ検証(要スコープ確認)
  - VC 発行
    - subject/holder 問題の解消が必要
- 構成
  - web アプリ or CLI

## DWebNode アプリ

- 概要
  DWebNode の機能とトレース機能を有する web アプリ
- 要件
  PermissionGrant インターフェースを提供する
  CollectionRead インターフェースを提供する
  CollectionWrite インターフェースを提供する
  DWebNode の authentication に従って認証できる
  アクセスログを記録できる
  アクセスログを取得できる
- 構成
  - nodejs
  - ion-tool
  - dwn-sdk

## サイト閲覧補助エクステンション

- 概要
  閲覧サイトの安全性を検証、データ提供のコントロール機能を有するブラウザエクステンション
- 要件
  - Root となる DID が発行できる
  - 閲覧したサイトを自動的に検証する
  - 検証に成功したサイトには自動的にパーソナルデータを提供できる
  - 検証に失敗したサイトには選択的にパーソナルデータを提供できる
  - 提供したパーソナルデータのアクセス履歴を表示できる
  - 提供したパーソナルデータを無効化できる
- 構成
  - react
  - ion-tool
  - dwn-sdk

## メディアサイト/アドテク事業者サイトの擬似アプリ

- 概要
  エクステンションと協調して動作する閲覧サイト側の機能のサンプル実装
- 要件
  - 非 BotVC を検証できる
  - 閲覧者のパーソナルデータを取得できる
  - 利用範囲に沿って通信をブロックできる(webtre 相当の機能)
- 構成
  - nodejs
  - react
  - ion-tool

---

# 共通事項

認証を要する DWebNode に格納するデータは`published`: false で書き込む

---

# DWebNode

## メッセージフォーマット

### Personal Data

- descriptor
- payload
  - Not Bot VC
  - AdID
  - Mail Address

### Access Log

access log message

```
{
     descriptor: {
      method: 'CollectionsWrite',
      schema: 'https://schema.org/AccessLog', <- アクセスログ
      target: <d-web nodeアプリ(本来はパーソナルデータの所有者)>,
      published: false,
      recipient: <パーソナルデータ所有者>,
    },
    encodedData: <データ本体>
  }
```

encodedData をデコードした内容

```
{
  "accessor": <アクセスしたDID>,
  "recordId": <アクセスされたデータのレコードID>,
  "schema": <アクセスされたデータのスキーマ>
}
```

アクセスログの target をパーソナルデータの所有者にすることは仕様上は許容されているが、そのための権限を付与する機能が未実憎のため本プロジェクトでは便宜的に DWebNode のホスティング事業者が所有者となる仕様とする。
https://github.com/TBD54566975/dwn-sdk-js/blob/2ab865cb22b1ac6212281a16951085a5bdeb7cfd/src/core/auth.ts#L106

### Provide Data History

```
{
     descriptor: {
      method: 'CollectionsWrite',
      schema: <提供履歴>,
      target: <拡張機能利用者本人>,
      published: false,
      recipient: <拡張機能利用者本人>,
    },
    encodedData: <データ本体>
  }
```

## アクセス権

|                  | target                                        | recipient                 | author          | published |
| ---------------- | --------------------------------------------- | ------------------------- | --------------- | --------- |
| 組織正当性証明   | 事業者                                        | なし                      | 事業者          | true      |
| パーソナルデータ | 所有者                                        | 1st パーティ/3rd パーティ | 所有者          | false     |
| アクセスログ     | DWebNode 事業者(本来はパーソナルデータ所有者) | パーソナルデータの所有者  | DWebNode 事業者 | false     |

※ author はサイナーが自動的に適用される。

---

# その他

## 課題検証メモ

### 非 BotVC 関連

**DIF で検討済みのユースケースで近しいもの**

1. Holder Acts on Behalf of the Verifier, or has no Relationship with the Subject, Issuer, or Verifier
   https://www.w3.org/TR/vc-data-model/#holder-acts-on-behalf-of-the-verifier-or-has-no-relationship-with-the-subject-issuer-or-verifier
   > The Verifiable Credentials Data Model currently does not support either of these scenarios. It is for further study how they might be supported.

このケースに該当すると考えられるがその場合のデータモデルはまだ定義されていない

2. Subject Passes a Verifiable Credential to Someone Else
   https://www.w3.org/TR/vc-data-model/#subject-passes-a-verifiable-credential-to-someone-else
   オリジナルの subject が issure となって holder に VC を渡すので実現可能ではある

ただし、オリジナルの DID とペアワイズで払い出した DID の関係が公開されるため、この関係を集めることで名寄せが可能となる事が問題となる。

この他の手段としてオリジナルの subject を非公開にしつつ、検証可能な VC を発行する方法がないか？

```json
{
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://www.w3.org/2018/credentials/examples/v1"
  ],
  "id": "https://example.com/VP/0987654321",
  "type": ["VerifiablePresentation"],
  "verifiableCredential": [
    {
     "@context": [
       "https://www.w3.org/2018/credentials/v1",
       "https://www.w3.org/2018/credentials/examples/v1"
      ],
      "id": "http://pharma.example.com/credentials/3732",
      "type": ["VerifiableCredential", "PrescriptionCredential"],
      "issuer": "https://pharma.example.com/issuer/4", // original issure
      "issuanceDate": "2010-01-01T19:23:24Z",
      "credentialSubject": {
        "id": "did:example:ebfeb1f712ebc6f1c276e12ec21", // original subject
        "prescription": {....}
      },
      "proof": {....}
    },
    {
      "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://www.w3.org/2018/credentials/examples/v1"
      ],
      "id": "https://example.com/VC/123456789",
      "type": ["VerifiableCredential", "PrescriptionCredential"],
      "issuer": "did:example:ebfeb1f712ebc6f1c276e12ec21", // original subject
      "issuanceDate": "2010-01-03T19:53:24Z",
      "credentialSubject": {
        "id": "did:example:76e12ec21ebhyu1f712ebc6f1z2", // holder
        "prescription": {....}
      },
      "proof": {
        "type": "RsaSignature2018",
        "created": "2018-06-17T10:03:48Z",
        "proofPurpose": "assertionMethod",
        "jws": "pYw8XNi1..Cky6Ed=",
        "verificationMethod": "did:example:ebfeb1f712ebc6f1c276e12ec21/keys/234" // original subject
      }
    }
  ],
  "proof": [{
    "type": "RsaSignature2018",
    "created": "2018-06-18T21:19:10Z",
    "proofPurpose": "authentication",
    "verificationMethod": "did:example:76e12ec21ebhyu1f712ebc6f1z2/keys/2", // holder
    "challenge": "c0ae1c8e-c7e7-469f-b252-86e6a0e7387e",
    "jws": "BavEll0/I1..W3JT24="
  }]
}
```

3. Acts on Behalf of the Subject
   https://www.w3.org/TR/vc-data-model/#holder-acts-on-behalf-of-the-subject
   第３者(この場合は審査機関)が subject と holder の関係を担保するモデルなので実現性の観点(審査機関が介在する時点では holder が存在しない)でマッチしない
