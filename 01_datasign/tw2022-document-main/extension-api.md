[TOC]
---

## 通信ブロック

V2まではブラウザ共通で利用可能なAPI`webRequest`がある
- [Mozilla webRequest](https://developer.mozilla.org/ja/docs/Mozilla/Add-ons/WebExtensions/API/webRequest)
- [Chrome webRequest](https://developer.chrome.com/docs/extensions/reference/webRequest/)

[modifying-network-requests](https://developer.chrome.com/docs/extensions/mv3/mv3-migration/#modifying-network-requests)
> Extensions that modify network requests will need to transition from the blocking version of the Web Request API to the new Declarative Net Request API.

但し、V2からは新しいAPI `declarativeNetRequest`への移行が始まっていて、Chromeでは今後V2での公開が許可されないためこちらのAPIを使う必要がある
※ `webRequest`自体は残っていて利用可能。通信の改変やブロックなどを伴わない、例えば発生するリクエストを観測するなどの利用は可能

V3では[declarativeNetRequest](https://developer.chrome.com/docs/extensions/reference/declarativeNetRequest/)が利用できる
`webRequest`では実際に発生する通信に対してイベントハンドラを登録して、その中で通信を許可する/ブロックする、という制御方法になっていたのに対して、`declarativeNetRequest`では目的のリクエストに対するルールを宣言することで、実際に通信が発生する前にその通信に対する作用を適用することができる。

ルール提供サンプルコード
```javascript
const rule = {
  id: 1,
  priority: 1,
  action: { "type": "block" },
  condition: {
    "domainType": "thirdParty"
  }
};
chrome.declarativeNetRequest.updateDynamicRules(
  {
    addRules: [rule]
  },
);
```

V3関連情報
- Chromeで`webRequest`を利用するためには`force-installed`が必要
[Can Manifest V3 extensions use blocking Web Request?](https://developer.chrome.com/docs/extensions/mv3/mv3-migration/#when-use-blocking-webrequest)
    > The blocking version of the Web Request API exists in Manifest V3, but it can only be used by extensions that are force-installed using Chrome's enterprise policies

- firefoxでは今後も`webRequest`を維持しつつ、`declarativeNetRequest`をサポートする予定
[Manifest v3 in Firefox: Recap & Next Steps](https://blog.mozilla.org/addons/2022/05/18/manifest-v3-in-firefox-recap-next-steps/)

    >Mozilla will maintain support for blocking WebRequest in MV3. To maximize compatibility with other browsers, we will also ship support for declarativeNetRequest. 

---

## 発生する通信の収集
通信が発生する前にブロックする仕組みのため、ブロックしつつ発生するリクエストの確認はできない
ブロックしたURLの情報など取る手段は無さそう
よって、パーソナルデータに含まれる利用範囲に従った通信の許可とブロックはエクステンションの外部ツール(webtru)に任せる構成となる

ブロックしていない通信は以下の様に収集可能
```javascript
chrome.webRequest.onBeforeRequest.addListener(
    async function(details) {
      const tabs = await chrome.tabs.query(
          {
            active: true
          }
      );
      if (0 < tabs.length) {
        const tabId = tabs[0].id;
        if (details.tabId === tabId) {
          // console.debug({ details });
          console.debug({ url: details.url, initiator: details.initiator });
        }
      }
      return {cancel: false};
    },
    {urls: ["<all_urls>"]},
);
```

#### webpageと拡張機能のコミュニケーション手段
1. [Sending messages from web pages](https://developer.chrome.com/docs/extensions/mv3/messaging/#external-webpage)
2. [Simple one-time requests](https://developer.chrome.com/docs/extensions/mv3/messaging/#simple)
3. [communicating_with_the_web_page](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Content_scripts#communicating_with_the_web_page)

| no  | api            | webpage     | Content scripts   | Background scripts | url            | 
| --- | -------------- | ----------- | ---------------- | ----------------- | -------------- | 
| 1   | chrome.runtime | sendMessage | -                | onMessageExternal | white list     | 
| 2   | chrome.runtime | -           | sendMessage      | onMessage         | no restriction | 
| 3   | window         | postMessage | addEventListener | -                 | no restriction | 

1の方式でURLが拡張機能の制約としてホワイトリスト形式となっている理由は、おそらく悪意のあるサイトからの下記のような拡張機能の任意のAPIを実行する類の攻撃を防ぐためと考えられる

```
// content-script.js

window.addEventListener("message", (event) => {
  if (
    event.source === window &&
    event?.data?.direction === "from-page-script"
  ) {
    eval(event.data.message);
  }
});
```
[communicating_with_the_web_page](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Content_scripts#communicating_with_the_web_page)より引用

- 制約等の補足
[こちら](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Content_scripts)の説明内容から、Content scripts/Background scriptsの制約は以下の通りになっている

    |                | runtime context   | accessible api                    | 
    | -------------- | --------- | --------------------------------- | 
    | web page       | web page  | Window                            | 
    | Content scripts | web page  | Window<br>Extension APIs(subset) | 
    | Background scripts| extension | Extension APIs(all)              | 

    `runtime.onMessageExternal`はcontent scriptでは使用できず([Mozilla](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/onMessageExternal), [Chrome](https://developer.chrome.com/docs/extensions/reference/runtime/#event-onMessageExternal))、background等での使用となり、その場合は拡張機能の全てのAPIが利用可能なことからも、上記の制限が掛かるものと考えれれる。

#### 方式比較
- 方式1: 対象とするURLを限定できないため採用できない。
- 方式2: localstorageへのアクセスは可能だが、書き込みタイミングがwebpage側の制御となるため、最新のデータが書き込まれたタイミングでアクセス手段が無い？
- 方式3: webpage側にメッセージ送信を実装してもらう前提が成り立つなら採用可能

https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Content_scripts#loading_content_scripts
ここの説明ではpage's javascriptが先に実行されてから、content scriptが実行される順序となっている

## リファレンス
[Chrome Extension development overview](https://developer.chrome.com/docs/extensions/mv3/devguide/)

[Chrome Extension API Reference](https://developer.chrome.com/docs/extensions/reference/)

### その他参考リンク
https://developer.chrome.com/docs/extensions/mv3/architecture-overview/
https://developer.chrome.com/docs/extensions/mv3/getstarted/tut-focus-mode/
https://developer.chrome.com/docs/extensions/mv3/getstarted/extensions-101/
https://developer.chrome.com/docs/extensions/whatsnew/
https://developer.chrome.com/docs/extensions/mv3/service_workers/
