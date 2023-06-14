## [toc]

# 組織正当性証明 OP 発行

## 組織正当性証明 OP 発行

~~前もって CLI で生成しておいた DID をもとに web アプリから組織正当性証明 VC を発行発行する
組織正当性のクレームの入力内容は以下の内容のとおり~~
https://www.jicdaq.or.jp/files/dl/dl_005.pdf
VC ではなく OP(Originator Profile)を使用することになったため、jicdaq の検証・確認は一部(認証事業領域、事業形態)のみを`businessCategory`使用する

### register originator profile

```puml
@startuml
hide footbox

Actor 企業担当者 as company
participant CLI_Tool as cli
Actor 審査機関担当者 as manager
participant "審査ページ" as webapp
database Storage as db

company -> cli: create DID
note right
  publicKey.json
  service.json
end note
cli -> cli: issue pulic DID
cli --> company :return long form DID
company -> manager: 申請
note left
    - name
    - url
    - postalCode
    - addressCountry
    - addressRegion
    - addressLocality
    - streetAddress
    - businessCategory
    - did
end note
manager -> webapp: input
note left
    - type
    - name
    - url
    - postalCode
    - addressCountry
    - addressRegion
    - addressLocality
    - streetAddress
    - businessCategory
    - did
end note
webapp -> db: store info
note left
  - did
  - holderInfo(json)
end note

@enduml
```

#### service.json

```json
[
  {
    "id": "'domain-1",
    "type": "'LinkedDomains",
    "serviceEndpoint": "'https://foo.example.com"
  }
]
```

#### pubkey.json

```json
[
  {
    "id": "key-1",
    "type": "JsonWebKey2020",
    "publicKeyJwk": {
      "kty": "EC",
      "crv": "secp256k1",
      "x": "wKuJ_upsAM9k73ihgc8XKUO0S7JwaxMPdkFZzhZwXgg",
      "y": "U24QhurSNpPllprSKBAtpvb_rMJKU7BgfhdTQ88V4V4"
    },
    "purposes": ["authentication"]
  }
]
```

#### holders profiles

```json
{
  "url": "https://xxx.com/",
  "name": "string",
  "postalCode": "1111111",
  "addressCountry": "japan",
  "addressRegion": "tokyo",
  "addressLocality": "shibuya",
  "streetAddress": "1-1-1",
  "businessCategory": [
    "adCompany",
    "advertiser",
    "dsp",
    "ssp",
    "adNetwork",
    "adExchange",
    "media",
    "adVerification",
    "analytics"
  ],
  "did": "did:ion:xxxxxxxxxxxx"
}
```

### list registerd info and create profile set

```puml
@startuml

participant "メディアサイト" as mediaSite
Actor メディア担当者 as media
participant "審査ページ" as webapp
database Storage as db

media -> webapp: request op list
webapp -> db: search all holders
db --> webapp: return all holders
webapp --> media: show holders list
note right
    - did
    - name
    - url
    - dateOfIssue
    - link to op Jwt
end note
media -> webapp: select op link
webapp -> db: select holder info
db --> webapp: return holder info
webapp -> webapp: build op from holder info
webapp -> webapp: encode op to jwt with issure's keypair
webapp --> media: return Profiles Set as jsonfile
media -> media: create profile set
media -> mediaSite: put profile set
note right
    - path
      - /.well-known/op-document
end note


@enduml
```

#### originator profile

```json
{
  "https://certifier.com/jwt/claims/op": {
    "item": [
      {
        "type": "credential"
      },
      {
        "type": "certifier",
        "url": "https://certifier.com",
        "name": "Certifier Inc",
        "postalCode": "111-1111",
        "addressCountry": "JP",
        "addressRegion": "Tokyo",
        "addressLocality": "Shibuya",
        "streetAddress": "1-1-1"
      },
      {
        "type": "holder",
        "url": "https://publisher.com",
        "name": "Publisher Inc.",
        "postalCode": "000-0000",
        "addressCountry": "JP",
        "addressRegion": "Tokyo",
        "addressLocality": "Chiyoda",
        "streetAddress": "0-0-0",
        "businessCategory": ["media"]
      }
    ]
  },
  "iss": "https://issuer.com",
  "sub": "https://publisher.com",
  "iat": 1665726894,
  "exp": 1697262894
}
```

#### type of businessCategory

```javascript
type businessCategory =
  | "adCompany"
  | "advertiser"
  | "dsp"
  | "ssp"
  | "adNetwork"
  | "adExchange"
  | "media"
  | "adVerification"
  | "analytics";
```

#### profie set

```json
{
  "@context": "https://oprdev.herokuapp.com/context",
  "publisher": ["https://publisher.com"],
  "advertiser": [
    "https://advertiser.com",
    "https://dsp.com",
    "https://analytics.com"
  ],
  "profile": [
    "publisherEndodedJwt",
    "advertiserEndodedJwt",
    "dspEndodedJwt",
    "analyticsEndodedJwt"
  ]
}
```
