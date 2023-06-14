
## 6.3.1. json-web-token
https://www.w3.org/TR/vc-data-model/#json-web-token

## JWTの利点
1. ゼロ知識証明をサポート
(Proof format supports Zero-Knowledge Proofs.)
JWT は、ゼロ知識証明などの否認可能(repudiable)な証明の`proof`属性を埋め込むことができます。その場合、JWS には署名要素がありません。
(ちょっと何言ってるかワカラナイ。否認できたら意味無くない？誤記？)

2. Proof of Work, Timestamp Proofs, and Proof of Stakeなどの任意の証明をサポート
(Proof format supports arbitrary proofs such as Proof of Work, Timestamp Proofs, and Proof of Stake.)
JWT は、Proof of Work、Timestamp、Proofs、Proof Stake など、あらゆる種類の証明の`proof`属性を埋め込むことができます。

3. 既存の公式標準に基づく
(Based on existing official standards.)
JSON と JWT は提案され、成熟した IETF 標準です。 JSON-LD 1.0 は W3C で REC 状態ですが、JSON-LD 1.1 はまだ WD 状態です。 LD-Proofsはまったく標準化されていません。

4. サイズが小さくなる設計
(Designed to be small in size.)
JSON は、ネットワーク上で送信される単純なデータ形式として発明されました。検証可能なクレデンシャルは、@context などの追加のメタ情報を導入する必要なく、属性のみで表現できます。
これにより、結果として得られる JSON+JWT 資格情報も、通常、サイズが小さくなります。

5. 追加処理不要のオフラインサポート
(Offline support without further processing.)
JWT は、外部ドキュメントを取得または検証する必要なく、JWT 自体を完全に記述することができます。
JSON-LD では、コンテキストがクエリ可能である必要があり、普及しているドキュメント (LD-Proof など) をチェックするために他のドキュメントにアクセスできる必要があります。オフラインの使用例をサポートするには、追加のキャッシュを実装する必要があります。

6. 他の既存の規格における広い採用
(Wide adoption in other existing standards.)
JWT は、OAuth2、OpenID Connect など、他の多くの既存の標準でそのアプリケーションを確立しています。
これにより、既存の認証および承認フレームワークとの下位互換性が可能になり、これらのレガシー システムにわずかな変更を加えるか、わずかに変更するだけで済みます。

7. 型の非曖昧性
(No type ambiguity.)
通常、JSON データ構造は内部属性の型の変更を予期しないことがベスト プラクティスです。
JSON-LD には、データ型を切り替えるためだけに単一の要素で配列を変換する、コンパクトな形式のシリアライゼーションが暗黙的にサポートされています。
パーサーを作成する開発者は、これらのデータ型の特別な処理を実装する必要があります。その結果、コードが増え、エラーが発生しやすくなり、静的型に依存するコード生成に基づくパーサーが許可されない場合があります。

8. 幅広いライブラリのサポート
(Broad library support.)
JWT と JSON は、その成熟度と標準化により、多くのオープンソース ライブラリをサポートしています。
JSON-LD 1.0 は標準であり、さまざまなプログラミング言語をサポートしていますが、JavaScript などのネイティブ プラットフォーム ツールチェーンの一部であることが多い JSON にはまだ遅れをとっています。
一方、LD-Proofs の場合、分散したライブラリはわずかしか存在しません。

9. 署名されているものの理解容易性
(Easy to understand what is signed.)
JWT は、LD-Proofsとは対照的に署名されているものを可視化します。
LD署名は、実際のペイロードから分離され、外部ドキュメントへのリンクが含まれている。これにより、開発者が署名の一部を理解することが明らかではなくなります。

10. 既存のシステムで authn/authz トークンとして使用する機能
(Ability to be used as authn/authz token with existing systems.)
多くの既存のアプリケーションは、認証と認可の目的で JWT に依存しています。
理論的には、これらのアプリケーションを維持している開発者は、わずかな変更または変更なしで、現在のシステムで JWT ベースの検証可能なプレゼンテーションを活用できます。
LD-Proofs は、同じ結果を得るためにさらに多くの作業を必要とする新しいアプローチを表しています。

11. 追加の正規化は不要
(No additional canonicalization required.)
base64 URLエンコーディングに加えて、JSON と JWTはネットワーク上で送信するために何かしらの正規化を必要はありません。JWS は、ペイロード内の任意のデータで計算できます。
これにより、正規化が必要な JSON-LD および LD-Proofs と比較して、計算が少なく、複雑さが少なく、ライブラリが軽量になります。

12. PKI不要
(No Internet PKI required.)
JSON-LD と LD-Proofs は、@context などの外部ドキュメントの解決に依存しています。これは、検証可能なクレデンシャル システムが既存のインターネット PKI にある程度依存し、完全に分散化できないことを意味します。
JWT ベースのシステムでは、この依存関係を導入する必要はありません。

13. 外部ドキュメントの解決は不要
(No resolution of external documents needed.)
JSON-LD および LD-Proofs では、外部ドキュメントの解決が必要です。これにより、検証可能なプレゼンテーションの検証者のネットワーク負荷が増加します。これは、キャッシュ戦略によって軽減する必要があります。

## LDの利点
1. open world data modelサポート
(Support for open world data modelling)
`open world data model`は、ステートメントのセマンティクスが明確であることを保証しながら、あらゆるエンティティがあらゆることについて任意のステートメントを作成できるモデルです。 この仕様は、Linked Data と呼ばれる`open world data model`によって実現されます。 `open world data model`サポートすることの特徴の 1 つは、データが表現されるセマンティック コンテキストを指定できることです。 JSON-LD は、@context プロパティを介してこのメカニズムを提供します。 JSONにはそのような機能はありません。

2. URI を使用した JSON オブジェクトのユニバーサル識別子メカニズム
(Universal identifier mechanism for JSON objects via the use of URIs.)
JSON-LD ドキュメント内のすべてのエンティティは、自動 URI または明示的な URI を介して識別されます。 これにより、ドキュメント内のすべてのエンティティを明確に参照できます。 JSONの型にはURI 型がなく、オブジェクトにURI型を要求する必要もないため、JSON で表現されたエンティティを明確に識別することは困難または不可能です。

3. コンテキストを介して IRI にマッピングすることにより、異なる JSON ドキュメント間で共有されるプロパティを明確にする方法
(A way to disambiguate properties shared among different JSON documents by mapping them to IRIs via a context.)
プロパティ「ホームページ」など、JSON-LD ドキュメント内のすべてのオブジェクト プロパティは、キーワードであるか、IRI にマップされます。 この機能により、`open world data model`システムは、プロパティのセマンティックな意味を明確な方法で識別できるようになり、異種システム間でのデータのシームレスなマージが可能になります。
JSON オブジェクトのプロパティは IRI にマップされないため、プロパティのセマンティックな意味が曖昧になります。 たとえば、ある JSON ドキュメントでは、「タイトル」(「本のタイトル」を意味する) を使用する方法が、「タイトル」(「役職」を意味する) を使用する別の JSON ドキュメントと意味的に互換性がない場合があります。

4. セマンティクスまたは構造のマージ競合なしでデータをローカルドキュメントとマージ可能な、外部ドキュメント内のデータを参照するメカニズム
(A mechanism to refer to data in an external document, where the data may be merged with the local document without a merge conflict in semantics or structure.)
JSON-LD は、データ値が URL を使用してローカル ドキュメントの外部のデータを参照できるようにするメカニズムを提供します。 この外部データは、セマンティクスまたは構造のマージ競合なしに、ローカル ドキュメントと自動的にマージされます。この機能により、システムは「FollowYourNose」原則を適用して、ローカル ドキュメントに関連付けられたより豊富なデータ セットを検出できます。
JSON ドキュメントには外部データへのポインターを含めることができますが、ポインターの解釈は多くの場合アプリケーション固有であり、通常、外部データをマージしてより豊富なデータ セットを構築することはサポートされていません。

5. 文字列に言語で注釈を付ける機能
(The ability to annotate strings with their language.)
JSON-LD を使用すると、開発者は言語タグを使用してテキスト文字列を表現する言語 (英語、フランス語、日本語など) を指定できます。 JSON はそのような機能を提供しません。

6. 日付や時刻などの任意のデータ型を任意のプロパティ値に関連付ける方法。
(A way to associate arbitrary datatypes, such as dates and times, with arbitrary property values.)
JSON-LD を使用すると、開発者は JSON-LD コンテキストで指定することにより、日付、符号なし整数、温度などのプロパティ値のデータ型を指定できます。 JSON はそのような機能を提供しません。

7. ソーシャル ネットワークなどの 1 つまたは複数の有向グラフを 1 つのドキュメントで表現する機能
(A facility to express one or more directed graphs, such as a social network, in a single document.)
JSON-LD の抽象データ モデルは、ラベル付けされたノードとエッジの有向グラフとしての情報の表現をサポートし、`open world data model`のサポートを可能にします。
JSON の抽象データ モデルは、ラベルのないノードとエッジのツリーとしての情報の表現のみをサポートします。これにより、言語でネイティブに表現できる関係と構造のタイプが制限されます。

8. 署名セットのサポート
(Supports signature sets.)
署名セットは、データ ペイロードに対する署名の順序付けられていないセットです。 法的契約に適用される暗号署名などのユースケースでは、通常、契約条件に基づいて 2 つ以上の当事者を法的に拘束するために、複数の署名を契約に関連付ける必要があります。
Linked Data Signatures を含む Linked Data Proofs は、一連の署名をネイティブにサポートします。
JWT は、単一のペイロードに対して単一の署名のみを有効にします。

9. 検索クローラーが機械可読コンテンツのインデックスを作成できるように、HTML に埋め込むことができます
(Embeddable in HTML such that search crawlers will index the machine-readable content.)
すべての主要な検索クローラーは、HTML ページで JSON-LD として表現された情報をネイティブに解析し、インデックスを作成します。
LD-Proofs は、検索エンジンが使用する現在のデータ形式を拡張して、デジタル署名をサポートできるようにします。
JWT には、HTML ページでデータを表現するメカニズムがなく、現在、検索クローラーによってインデックスが作成されていません。

10. ネットワーク上のデータは、デバッグやデータベース システムへのシリアライズが簡単
(Data on the wire is easy to debug and serialize to database systems.)
開発者がソフトウェア システムをデバッグする場合、一般的なデバッグ ツールを使用して操作中のデータを確認できると便利です。 同様に、ネットワークからデータベースにデータをシリアライズし、データベースからネットワークに戻る前処理と後処理の手順を最小限にできると便利です。
LD-Proof を使用すると、開発者は形式を別の形式や構造に変換することなく、一般的な JSON ツールを使用できます。
JWT はペイロード情報を base-64 でエンコードするため、デジタル署名を破壊せずにデータを JSON データに変換するための複雑な前後処理手順が必要になります。 同様に、JSON データのインデックス作成に通常使用されるスキーマレス データベースは、base-64 でエンコードされた不透明なラッパーで表現される情報をインデックス化できません。

11. 署名付きデータをネストしても、埋め込みごとにデータ サイズが 2 倍になるわけではありません。
(Nesting signed data does not cause data size to double for every embedding.)
JWT が別の JWT によってカプセル化されている場合、ペイロード全体を最初の JWT で base-64 エンコードし、カプセル化する JWT で再度 base-64 エンコードする必要があります。 これは、公証人のサービスを求める他の誰かによって署名された文書に公証人が署名する場合など、暗号署名を含む文書に暗号署名が必要な場合に必要になることがよくあります。
LD-Proofs では、ドキュメントの署名された部分を base-64 でエンコードする必要はありません。代わりに、ペイロード全体ではなく暗号化署名のみをエンコードする必要がある正規化プロセスに依存しています。

12. ゼロ知識証明サポート
(Proof format supports Zero-Knowledge Proofs.)
LD-Proof 形式は、暗号署名されたハッシュまたはハッシュを生成するアルゴリズムを変更できます。 この暗号化の敏捷性により、ゼロ知識証明などのデジタル署名システムを、まったく新しいデジタル署名コンテナ形式を作成する代わりに、LD-Proofs の上に重ねることができます。
JWT は、ゼロ知識証明をサポートするためにまったく新しいデジタル署名コンテナー形式が必要になるように設計されています。

13. Proof of Work, Timestamp Proofs, Proof of Stakeなどの任意の証明をサポート
(Proof format supports arbitrary proofs such as Proof of Work, Timestamp Proofs, and Proof of Stake.)
LD-Proof 形式は、より幅広い種類の証明を念頭に置いて設計されており、単純な暗号署名を超えた暗号証明をサポートしています。 これらの証明タイプは、分散型台帳などのシステムで一般的に使用されており、特定の主張が特定の時間に行われたことや、特定の資格情報を生成するために一定量のエネルギーが費やされたことを証明する機能など、検証可能な資格情報(VC)に追加の保証を提供します。 
JWT 形式は、任意の証明形式をサポートしていません。

14. XML、YAML、N-Quad、CBOR などの他のデータ構文で証明を変更せずに表現可能
(Proofs can be expressed unmodified in other data syntaxes such as XML, YAML, N-Quads, and CBOR.)
LD-Proof 形式は、正規化アルゴリズムを利用して、暗号証明アルゴリズムへの入力として使用される暗号ハッシュを生成します。 これにより、暗号証明として生成されたバイトをコンパクトにし、XML、YAML、N-Quad、CBOR などのさまざまな他の構文で表現できるようになります。
JWT を生成するには JSON を使用する必要があるため、JWT は JSON 構文と密接に結びついています。

15. プロパティ値の順序を変更したり、空白を導入したりしても、署名は無効になりません
(Changing property-value ordering, or introducing whitespace does not invalidate signature.)
LD-Proofs は正規化アルゴリズムを利用するため、表現される情報の意味を変更しないホワイトスペースの導入は、情報の最終的な暗号化ハッシュには影響しません。 つまり、スキーマレスデータベースにデータを書き込み、同じデータベースから同じ情報を取得するときに行われた変更など、ホワイトスペースのフォーマッティングの単純な変更によって、デジタル署名が失敗することはありません。
JWT は base-64 形式を使用してペイロードをエンコードします。base-64 形式は、表現される情報に影響を与えないホワイトスペースのフォーマッティングに耐性がありません。 JWT のこの欠点により、たとえば、クローラーのインデックスを検索する Web ページで署名されたデータを表現することが困難になります。

16. 実験的な署名システムを簡単にサポートできるように設計されています
(Designed to easily support experimental signature systems.)
LD-Proof フォーマットは当然拡張可能であり、名前空間の衝突を防ぐために正式な国際標準ワーキング グループでフォーマットを拡張する必要はありません。 JWT 形式では、名前の競合を回避するために集中レジストリにエントリが必要であり、LD-Proof 形式ほど簡単に実験をサポートすることはできません。
LD-Proof 形式の拡張は、他の LD-Proof 拡張と競合しないことが保証されている暗号化スイートの分散型公開を通じて行われます。 このアプローチにより、開発者は、選択的開示(selective disclosure)、ゼロ知識証明、ポスト量子アルゴリズムをサポートする新しい暗号署名メカニズムを簡単に試すことができます。

17. 署名チェーンをサポート
(Supports signature chaining.)
署名チェーンは、データ ペイロードに対する署名の順序付けられたセットです。 公証された文書に適用される暗号署名などのユースケースでは、通常、署名者による署名が必要であり、元の署名者が署名した後に公証人による追加の署名が必要です。
Linked Data Signatures を含む Linked Data Proofs は、署名のチェーンをネイティブにサポートします。
JWT は、単一のペイロードに対して単一の署名のみを有効にします。

18. 前処理も後処理も不要
(Does not require pre-processing or post-processing.)
検証可能なクレデンシャルまたは検証可能なプレゼンテーションを JWT にエンコードするには、データを JWT 形式に変換したり、JWT 形式から変換したりするための追加の手順が必要です。 LD-Proofs によって保護された検証可能なクレデンシャルと検証可能なプレゼンテーションには、そのような追加の変換ステップは必要ありません。

19. 正規化には base-64 エンコーディングのみが必要
(Canonicalization requires only base-64 encoding.)
JWT 形式は、単純な base-64 エンコード形式を利用して、データの暗号化ハッシュを生成します。 LD-Proofs のエンコード形式では、暗号化ハッシュを生成するために、より複雑な正規化アルゴリズムが必要です。 JWT アプローチの利点は、エンコードの柔軟性を犠牲にして単純化することです。 LD-Proof アプローチの利点は、実装の複雑さを犠牲にした柔軟性です。


## 比較
### 送信(tranmit)
|                             | 1. JSON + JWT | 2. JSON-LD + JWT      | 3. JSON-LD + LD-Proof | 
| --------------------------- | ------------- | --------------------- | --------------------- | 
| 仕様安定性                  | O             | O                     | X                     | 
| サイズ                      | O             | 1に比べ若干大きくなる | 1に比べ若干大きくなる | 
| 実装容易性                  | O             | O                     | X                     | 
| レガシーシステムとの親和性  | O             | O                     | X                     | 
| デバッグ/シリアライズ容易性 | X             | X                     | O                     | 

### 署名検証(verify signature)
|                                | 1. JSON + JWT | 2. JSON-LD + JWT | 3. JSON-LD + LD-Proof | 
| ------------------------------ | ------------- | ---------------- | --------------------- | 
| 仕様安定性                     | O             | O                | X                     | 
| 実装容易性                     | O             | O                | X                     | 
| オフラインサポート             | O             | O                | X                     | 
| レガシーシステムとの親和性     | O             | O                | X                     | 
| 複数/多段署名のサポート        | X             | X                | O                     | 
| 検索クローラー                 | X             | X                | O                     | 
| デバッグ/シリアライズ容易性    | X             | X                | O                     | 
| ゼロ知識証明サポート           | ?             | ?                | O                     | 
| フォーマット柔軟性             | X(JSON固定)   | X(JSON固定)      | O                     | 
| 新たな署名システムの実験容易性 | X             | X                | O                     | 

### 主張検証(verify claim)
|                                  | 1. JSON + JWT | 2. JSON-LD + (JWT or LD-Proof) | 
| -------------------------------- | ------------- | ------------------------------ | 
| 仕様安定性                       | X             | O                              | 
| サイズ                           | O             | X                              | 
| 実装容易性                       | O             | O                              | 
| オフラインサポート               | O             | X                              | 
| レガシーシステムとの親和性       | O             | O                              | 
| グローバルに一意なセマンティクス | X             | O                              | 
| 外部ドキュメントとの統合         | X             | O                              | 
| 柔軟な型定義                     | X             | O                              | 
| 多言語対応                       | X             | O                              | 
| 検索クローラー                   | X             | O                              | 
| デバッグ/シリアライズ容易性      | X             | O                              | 
| ゼロ知識証明サポート             | ?             | ?                              | 
| フォーマット柔軟性               | X             | O                              | 

---
# Referenctes
## [vc-imp-guide](https://w3c.github.io/vc-imp-guide)
- [using-the-jwt-aud-claim](https://w3c.github.io/vc-imp-guide/#using-the-jwt-aud-claim)
- [extending-jwts](https://w3c.github.io/vc-imp-guide/#extending-jwts)
    - public, named with a URI;
    - private, named with a local name;
    - registered with IANA.
        IANA
        https://www.iana.org/assignments/jwt/jwt.xhtml

## [vc-data-model](https://www.w3.org/TR/vc-data-model)
- [6.3. proof-formats](https://www.w3.org/TR/vc-data-model/#proof-formats)

> As such, each proofing mechanism has to specify whether the verification of the proof is calculated
    - against the state of the document as transmitted,
    - against the possibly transformed data model,
    - or against another form.
At the time of publication, at least two proof formats are being actively utilized by implementers and the Working Group felt that documenting what these proof formats are and how they are being used would be beneficial to implementers. 