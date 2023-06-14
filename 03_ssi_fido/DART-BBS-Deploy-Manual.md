<!--
This README describes the package. If you publish this package to pub.dev,
this README's contents appear on the landing page for your package.

For information about how to write a good package README, see the guide for
[writing package pages](https://dart.dev/guides/libraries/writing-package-pages).

For general information about developing packages, see the Dart guide for
[creating packages](https://dart.dev/guides/libraries/create-library-packages)
and the Flutter guide for
[developing packages and plugins](https://flutter.dev/developing-packages).
-->

## Getting started
```
git clone https://github.com/yoshiteru-furukawa/dart-bbs.git
```

in pubspec.yaml...
```
dependencies:
  dart_bbs:
    path: ../dart_bbs # path for this repository
```

## Usage(VCS)
You can learn the detail in test/test.dart or test2.dart

```dart
import 'dart:convert';
import 'package:dart_bbs/dart_bbs.dart';

void main() async {
  String VC = json.encode({
    "context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://www.w3.org/2018/credentials/examples/v1"
    ],
    "id": "http://localhost:9000/vc/1",
    "type": ["VerifiableCredential"],
    "issuer": "did:issuer:0001",
    "issuanceDate": "2022-10-09T10:15:55.382Z" // overridden
  });


  /* signed VC For selective disclosure 
    kid is used as "VerificationMethod" value in VC */
  String signedVC = await vcCreate(VC, issuerSecretKey, kid);
  print(signedVC); // String signedVC

  /* get Options 
   user selects property from options in PLR app */
  List<String> options = getOptions(signedVC);
  print(options); // List<String> selective messages

  /* create VP 
    kid is used as "VerificationMethod" value in VP */
  List<int> revealed = [0, 1, 2, 4];
  String VP = await vpCreate(signedVC, revealed, holderSecretKey, kid);
  print(VP); // String VP

  /* verify VP */
  String result = await vpVerify(VP);
  print(result); // bool result
}
```


## Usage(VDR)
You can learn the detail in test/test3.dart

```dart
import 'dart:convert';
import 'package:dart_bbs/dart_bbs.dart';

void main() async {

  String jwkSet = json.encode({
  "keys": [
    {
      "kty": "RSA",
      "n": "kY80Nkne6kMo7YUD-4klZfNffsf1jori8bfTaesN6f5gbXYo9mcUmibx_68Cm0NHeg0IMW95y2J8tcRk0tRqLdN246_SmQD4XfhDZMCD2cvJ2Du9ziBbqye8CC651_zGqHBJiCzf8qppQ7QcZwKtZ_d_useYfrLrb3KTHrrRVObzC0FX7fJHV010wFDNTQDiYFuvwY5CP4r7xOfUpGie7X3wnAZkhGa8DP61469MQboQA0ICcsGxJBI4JxmErO6D2VOXSFmrBMbXySVbWYVPTf7fZ_8MuevvBMp24A9Yu4vmQJyqq3PLM3Yq24Omtl4RcqjQMmSmFb0SdCXxesfPjQ==",
      "e": "AQAB"
    },
    {
      "kty": "OKP",
      "crv": "Bls12381G2",
      "x": "ra5S/xUwWnKBrxexHISuZlRRZPBjZ37wMvF3mfFiytW9urPY6JtiHzJ6t5jQCMHPE+aJ195CvaoS3uRGH0SoUjnGxeuMv+IcWpVhtmy2s1w7ZVgF7ZifpD0Bd9Eu8rpw"
    }
  ]
  });
  /* create DID */
  Map didResult = await createDid(jwkSet); // -> did:example:00000
  pprint(didResult);
  /*
  {
  "id": "did:example:issuer15",
  "keys": [
    {
      "kty": "RSA",
      "n": "kY80Nkne6kMo7YUD-4klZfNffsf1jori8bfTaesN6f5gbXYo9mcUmibx_68Cm0NHeg0IMW95y2J8tcRk0tRqLdN246_SmQD4XfhDZMCD2cvJ2Du9ziBbqye8CC651_zGqHBJiCzf8qppQ7QcZwKtZ_d_useYfrLrb3KTHrrRVObzC0FX7fJHV010wFDNTQDiYFuvwY5CP4r7xOfUpGie7X3wnAZkhGa8DP61469MQboQA0ICcsGxJBI4JxmErO6D2VOXSFmrBMbXySVbWYVPTf7fZ_8MuevvBMp24A9Yu4vmQJyqq3PLM3Yq24Omtl4RcqjQMmSmFb0SdCXxesfPjQ==",
      "e": "AQAB",
      "kid": "did:example:issuer15#1"
    },
    {
      "kty": "OKP",
      "crv": "Bls12381G2",
      "x": "ra5S/xUwWnKBrxexHISuZlRRZPBjZ37wMvF3mfFiytW9urPY6JtiHzJ6t5jQCMHPE+aJ195CvaoS3uRGH0SoUjnGxeuMv+IcWpVhtmy2s1w7ZVgF7ZifpD0Bd9Eu8rpw",
      "kid": "did:example:issuer15#2"
    }
  ]
} 
  */

  /* retrieve Key 
   return JWK (Map Format) */
  Map key = await retrieveKey(kid);
  pprint(key)

  /*
  {
  "e": "AQAB",
  "n": "kY80Nkne6kMo7YUD-4klZfNffsf1jori8bfTaesN6f5gbXYo9mcUmibx_68Cm0NHeg0IMW95y2J8tcRk0tRqLdN246_SmQD4XfhDZMCD2cvJ2Du9ziBbqye8CC651_zGqHBJiCzf8qppQ7QcZwKtZ_d_useYfrLrb3KTHrrRVObzC0FX7fJHV010wFDNTQDiYFuvwY5CP4r7xOfUpGie7X3wnAZkhGa8DP61469MQboQA0ICcsGxJBI4JxmErO6D2VOXSFmrBMbXySVbWYVPTf7fZ_8MuevvBMp24A9Yu4vmQJyqq3PLM3Yq24Omtl4RcqjQMmSmFb0SdCXxesfPjQ==",
  "kid": "did:example:issuer15#1",
  "kty": "RSA"
}
  */


}
```
