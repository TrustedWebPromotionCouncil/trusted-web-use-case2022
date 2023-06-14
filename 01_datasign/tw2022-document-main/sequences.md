[toc]
---

# 非Bot証明発行
## 非Bot証明実行
非Bot証明を受けたDIDを審査機関内のシステムに保持する。
その受け渡し手段としてissureを対象のDIDとするJWTを使用する。

```puml
@startuml
hide footbox
Actor user
participant "Extension(popup)" as ex
participant google
participant "審査機関" as webapp
database Storage as db

user -> ex: open popup
ex -> webapp
webapp -->ex: reCAPTCHA site key
ex -> ex: show reCAPTCHA
user -> ex: check 'i'm not a bot'
user -> ex: select images matched subject
user -> ex: submit a response
alt select correct images
    ex -> google: send user action result
    google --> ex: challenge
    user -> ex: click a submit button
    ex -> ex: create a jwt using private key
    ex -> webapp: post the jwt
    webapp -> webapp: verify the jwt
    webapp -> webapp: extract challeng and did
    webapp -> google: post the challenge
    google -> google: verify
    google --> webapp: verified result
    alt success
        webapp -> db: store the did as verifed as not bot
    end
end
@enduml
```

https://github.com/decentralized-identity/did-jwt
JWTフォーマットサンプル
```javascript
{
  header: { alg: 'ES256K', typ: 'JWT' },
  payload: {
    challenge: 'xxxxxxxxxxxxxxxxxxxx',
    iss: 'did:ion:123'
  },
  signature: 'mAhpAnw-9u57hyAaDufj2GPMbmuZyPDlU7aYSUMKk7P_9_cF3iLk-hFjFhb5xaUQB5nXYrciw6ZJ2RSAZI-IDQ',
}
```

```javascript
  const jwt = ''; // get it from url query
  const url = 'https://localhost:9000/api/not-bot/register';
  const opt = {
    method: 'post',
    body: `token=${jwt}`,
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
  }
  const response = await fetch(url, opt);
  if (response.status === 204) {
    // OK
  }
```

reCAPTCHAチャレンジサンプル
```
03AIIukzhHbseRV6zxM7fJaLN-iSrUk-ezDwDLlTQtlbw4OFFmvwKmqKDJ1WPUaQcbcKr0ZmSGVfa_wJp7W_2KYD4CJ9kIdDJWbvapMZx8eEsw5GgpN7v2bfamDUGwHSEHagdDR4LXaEEeYlJpvU4wXyDllquhKTQHLpvu40NhD_O36DK4hbmVje-faQF5J09zv7fQJ_FAQxa-K_oUrto9s1ezHZiZkejcRhqAVAig0L7jUoXq06vTILzKHTVuUL8JqfQa4n8Nn2dr3lrXW5bWnH7zHt3OWQ3hCdOwSSudGnl1_rnXi9SFQ-ntT2dCZJOK_Qk9y2Q7nFLqL3bWjJ6RafPKd4ZbNdZtV15MKyuss8FMwOndQG--J7D6Rz-jkMaNmfIj3eIWXeRt-60mZpDbuTRQKwoqyhPjMN8QC931FEP4pUPW-4BDxjFKw4lhpWQ6U5n-Nj_46vAB5EWqcwRb9dM2-IIq2tslTrpVdtxvRKlrNy--wueyKmK0siYoEjhKYKPZD6GzTAdT
```

## 非Bot証明実行(webでreCAPTCHA)

```puml
@startuml
hide footbox
Actor user
participant "Extension(popup)" as ex
participant "Extension(content_script)" as ex_content
participant "reCAPTCHA用Web" as recaptchaweb
participant google
participant "審査機関" as webapp
database Storage as db

user -> ex: open popup
ex -> recaptchaweb: open by tab
webapp --> recaptchaweb: reCAPTCHA site key
recaptchaweb -> recaptchaweb: show reCAPTCHA
user -> recaptchaweb: check 'i'm not a bot'
user -> recaptchaweb: select images matched subject
user -> recaptchaweb: submit a response
alt select correct images
    recaptchaweb -> google: send user action result
    google --> recaptchaweb: challenge
    recaptchaweb --> ex_content: redirect with challenge
    ex_content --> ex: challenge
    user -> ex: click a submit button
    ex -> ex: create a jwt using private key
    ex -> webapp: post the jwt
    webapp -> webapp: verify the jwt
    webapp -> webapp: extract challeng and did
    webapp -> google: post the challenge
    google -> google: verify
    google --> webapp: verified result
    alt success
        webapp -> db: store the did as verifed as not bot
    end
end
@enduml
```

## VC発行 (サイト閲覧時の流れの中に組み込まれる)
RootのDIDに対して事前に非Bot証明を受けている前提で、そのDIDをissureとするJWTにVCのsubjectとなるペアワイズDIDを含めてVC発行を審査機関に要求する。

```puml
@startuml
hide footbox

Actor user
participant Extension as ex
participant "審査機関" as webapp
database Storage as db
participant DWebNode as node

user -> ex: input password to unlock valt and get private key
ex -> ex: issure pairwise did
ex -> ex: create a jwt using private key of root did
ex -> webapp: jwt
webapp -> db: get did as verifed as not bot
db --> webapp: root did
webapp -> webapp: create vc
webapp --> ex: vc

@enduml
```

JWTフォーマットサンプル
```javascript
{
  header: { alg: 'ES256K', typ: 'JWT' },
  payload: {
    sub: 'did:ion:xxx',
    iss: 'did:ion:123'
  },
  signature: 'mAhpAnw-9u57hyAaDufj2GPMbmuZyPDlU7aYSUMKk7P_9_cF3iLk-hFjFhb5xaUQB5nXYrciw6ZJ2RSAZI-IDQ',
}
```

```javascript
  const jwt = '';
  const url = 'https://localhost:9000/api/not-bot/issue-vc';
  const opt = {
    method: 'post',
    body: `token=${jwt}`,
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
  }
  const response = await fetch(url, opt);
  if (response.status === 204) {
    // OK
  }
```

---

# 初回サイト閲覧時
```puml
@startuml
Actor user
box "client side" #white
participant Browser as b
participant "content script" as ex
participant "background" as ex_back
control "asynchronous handler" as ahandler
entity rules
database chromestorage as db
database localstorage as db2
end box
participant "1st party server" as  site 
participant "3rd party server" as  site3
participant "op server" as  site4
participant DWebNode as node1
participant ION as ion
participant "not bot vc issuer" as issuer

=== on install extension ==
ex_back -> ahandler: call hander asynchronouslly
ahandler -> rules: set 3rd party block rule
note right
    [rule1]
end note

=== open url ==

' --------------- 1st load ------------
user -> b: open url
b -> ex_back: on before navigate
ex_back -> ahandler: call hander asynchronouslly
b -> site: load html
site --> b: html
b ->x site3: request 3rd party resources

=== verify originator profiles ==
ahandler -> site: get 1st party's op document
site -> ahandler: op document
ahandler -> site4: get public key
ahandler -> ahandler: verify op
loop
  ahandler -> site4: get public key
  ahandler -> ahandler: verify op
end
b -> ex_back: on complete
note right
  complete event occurred but verification might not finished yet.
end note
ahandler -> db: save verified result


=== update blocking rules(add allow list) ==
ahandler -> ahandler: make allow list
ahandler -> rules: set allow rule
note right
    [rule1, rule2]
end note

=== reload ==
ahandler -> b: reload

' --------------- 2nd load ------------
b -> site: load html with did
site --> b: html
b -> site: request 1st party resources

b -> site3: request 3rd party resources
note right
    don't be blocked if the url is allowed by rule2
end note
b ->x site3: request 3rd party resources
note right
    blocked by extension
end note

=== issue pairwise did and provide personal data ==
b -> ex_back: on complete
ex_back -> db: get verifed result
db --> ex_back: verifed result
ahandler -> ex: post message(verified result)
alt exists ng profile
  ex -> user: ask user to provide data or not
  user -> b: click ok
end
ex -> ion: generate pairwise did
ion --> ex: new did
ex -> ex_back: post message(new did)
ex_back -> ahandler: post message(new did)
ahandler -> issuer: issue not bot vc
issuer --> ahandler: not bot vc
ahandler -> ahandler: create personal data vc
loop for valid op
  ahandler -> node1: send personal vc
end

ahandler -> db: save provided history
ahandler -> node1: save provided history

ex_back -> ex: notify did
ex -> db2: save did

@enduml
```

```puml
@startuml
Actor user
box "client side" #white
participant Browser as b
participant "1st party js" as js1
participant "3rd party js" as js3
database localstorage as db2
end box
participant "1st party server" as  site 
participant "3rd party server" as  site3
participant DWebNode as node1
participant ION as ion

=== get personal data ==
db2 -> js1: notify storage change (key and value)
db2 -> js3: notify storage change (key and value)

js1 -> site: send did jwt
site -> node1: get non-bot vc and verify it
alt not bot
    site -> node1: get personal data vc
end

js3 -> site3: send did jwt
site3 -> node1: get non-bot vc and verify it
alt not bot
    site3 -> node1: get personal data vc
end
@enduml
```

---

## メールアドレス提供
3rdpartyに対するアクセス権限の付与はデフォルトでは与えない
任意で権限を与えることも検討する

```puml
@startuml
Actor user
box "client site" #white
participant "popup" as ex
end box
participant DWebNode as node1
participant "1st party server" as  site 
participant "3rd party server" as  site3
Actor user2
Actor user3

=== provide mail address ==

user -> ex: open verification result
user -> ex: generate pairwise email
user -> ex: send pairwise email
  ex -> ex: create mail address vc
  ex -> node1: send mail address vc

=== get mail address(1st party) ==

user2 -> site: login
user2 -> site: get mail address
site -> node1: get vc
node1 -> node1: save access log
node1 --> site: vc

=== get mail address(3rd party) ==

user3 -> site3: login
user3 -> site3: get mail address
site3 -> node1: get vc
node1 -> node1: save access log
node1 --> site3: vc
@enduml
```

```puml
@startsalt
scale 1.5
{+ 
  --
  <&person> taro-yamada@example.com
  --
  閲覧サイト検証結果 >
  --
  パーソナルデータアクセス履歴 >
  --
}
@endsalt
```

Before Generating
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
    <not generated>
    [generate mail address]
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
}
@endsalt
```

Generated
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
    foo@bunsin.io
    [send mail address]
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
}
@endsalt
```