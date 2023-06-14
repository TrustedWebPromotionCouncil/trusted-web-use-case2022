[TOC]
---

# IF定義
---

## 1. 3rd party通信情報公開IF
本仕組みに準拠するサイトは発生する3rd partyリクエストの情報を以下のIFで公開する
(多言語表示の対象となる項目はi18Nextの機能に合わせた形で各言語の情報を渡す必要がある)

IF
```typescript
const I18nResourceValue {
    [key]: string;
}
const I18nResource {
    services: I18nResourceValue;
    providers: I18nResourceValue;
    serviceTypes: I18nResourceValue;
}
const I18nResources {
    ja: I18nResource;
    en: I18nResource;
}
const ThirdPartyDomain {
    id: string,
    provider: string;
    policyUrl: string;
    types: string[];
    domains: string[];
    requiredBySite: boolean;
    defaultCheckedBySite: boolean;
}
const ThirdPartyDomains {
    thirdPartyDomain: ThirdPartyDomain[];
    resources: I18nResources;
}
```
例
thirdPartyDomains
```json
{
    "thirdPartyDomains": [
        {
            "id": "1",
            "provider": "Google LLC",
            "policyUrl": "https://policies.google.com/privacy",
            "types": ["Tag Manager"],
            "domains": [
                "www.googletagmanager.com",
                "tagmanager.google.com"
            ],
            "requiredBySite": true,
            "defaultCheckedBySite": true,
        }
    ],
    "resources": {
        "ja": {
            "services": {
                "1": "Googleタグマネージャ",
            },
            "providers": {
                "Google LLC": "Google",
            },
            "serviceTypes": {
                "Tag Manager": "タグマネージャ",
            }
        },
        "en": {
            "services": {
                "1": "Google Tag Manager",
            },
            "providers": {
                "Google LLC": "Google LLC",
            },
            "serviceTypes": {
                "Tag Manager": "Tag Manager",
            }
        }
    }
}
```

```javascript
// en
i18next.t('services.1'); // => Google Tag Manager
i18next.t('providers.Google_LLC'); // => Google LLC
i18next.t('serviceTypes.Tag_Manager'); // => Tag Manager
// ja
i18next.t('services.1'); // => Googleタグマネージャ
i18next.t('providers.Google_LLC'); // => Google
i18next.t('serviceTypes.Tag_Manager'); // => タグマネージャ
```

---

## 2. ブロック設定IF
DWebNodeにパーソナルテータとして下記IFで選択状態を持つ

```typescript
const ConfigurableDomain {
    id: string,
    permitted: boolean;
}
```

```json
[
    {
        "id": "1",
        "permitted": true,
    },
    {
        "id": "2",
        "permitted": true,
    }
]
```

# リファレンス
https://www.i18next.com/