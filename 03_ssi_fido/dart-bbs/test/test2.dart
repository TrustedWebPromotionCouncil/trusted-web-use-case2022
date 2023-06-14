import 'dart:convert';
import 'package:dart_bbs/dart_bbs.dart';
import 'package:dart_bbs/src/models/vc.dart';
import 'package:dart_bbs/src/rsa_signature/convert_rsa_key.dart';
import 'package:dart_bbs/src/rsa_signature/gen_rsa_key_pair.dart';
import 'package:dart_bbs/src/utils/pprint.dart';
import 'package:dart_bbs/src/vdr/create_did.dart';

void main() async {
  String VC = json.encode({
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://purl.imsglobal.org/spec/ob/v3p0/context.json",
      "https://www.u-tokyo.ac.jp/oid/context.json"
    ],
    "id": "http://credentials.u-tokyo.ac.jp/transcript/12345",
    "type": ["VerifiableCredential", "OpenBadgeCredential"],
    "issuer": {
      "id": "did:xxx:issuersid1234567890",
      "type": "Profile",
      "name": "The University of Tokyo"
    },
    "issuanceDate": "2010-01-01T00:00:00Z",
    "holder": {
      "id": "did:xxx:holderid1234567890",
      "type": "Profile",
      "name": "SATO, Hiroyuki",
      "birthday": "0000-00-00",
      "sex": "male",
      "Address": "Tokyo, Japan"
    },
    "name": "Transcript",
    "credentialSubject": [
      {
        "id": "http://credentials.u-tokyo.ac.jp/degree/phd/science/12345",
        "type": "AchievementSubject",
        "identifier": {
          "type": "IdentityObject",
          "identityType": "userName",
          "hashed": "false",
          "identityHash": "SATO Hiroyuki",
          "birthday": "0000-00-00",
          "sex": "male"
        },
        "creditsEarned": "4.0",
        "Result": {"achievedLevel": "A"},
        "achievement": {
          "id": "http://credentials.u-tokyo.ac.jp/degree/phd/science/12345",
          "type": "Course",
          "criteria": "abc",
          "description": "abc",
          "name": "Compiler Construction"
        }
      },
      {
        "id": "http://credentials.u-tokyo.ac.jp/degree/phd/science/12345",
        "type": "AchievementSubject",
        "identifier": {
          "type": "IdentityObject",
          "identityType": "userName",
          "hashed": "false",
          "identityHash": "SATO Hiroyuki",
          "birthday": "0000-00-00",
          "sex": "male"
        },
        "creditsEarned": "4.0",
        "Result": {"achievedLevel": "S"},
        "achievement": {
          "id": "http://credentials.u-tokyo.ac.jp/degree/phd/science/23456",
          "type": "Course",
          "criteria": "abc",
          "description": "abc",
          "name": "Linear Algebra"
        }
      },
      {
        "id": "http://credentials.u-tokyo.ac.jp/degree/phd/science/12345",
        "type": "AchievementSubject",
        "identifier": {
          "type": "IdentityObject",
          "identityType": "userName",
          "hashed": "false",
          "identityHash": "SATO Hiroyuki",
          "birthday": "0000-00-00",
          "sex": "male"
        },
        "creditsEarned": "4.0",
        "Result": {"achievedLevel": "B"},
        "achievement": {
          "id": "http://credentials.u-tokyo.ac.jp/degree/phd/science/23456",
          "type": "Course",
          "criteria": "abc",
          "description": "abc",
          "name": "Machine Learning I"
        }
      }
    ],
    "proof": {
      "type": "BbsBlsSignature2020",
      "created": "2022-12-20T00:00:00Z",
      "verificationMethod": "did:example:489398593#test",
      "proofPurpose": "assertionMethod",
      "proofValue":
          "eyJhbGciOiJFZERTQSJ9.MWI4Mjk4MDU0OTZkYzRkMGU0ODY1Y2RiNDdjZDM0MjljNzUxM2JkODY2NmU5OWUzMzBiZWE3NmRmZWIxMmNkNQ.pUJSf-fnVjiggDhxMyzZMaC4Sn23XPF9B96BLCKsNv13tB44bDs77TR7FaWIpHI3H6xRoOMkFFvk3KVq_b8GDA"
    }
  });
  /* Issuer's keyPair 
  keyPair(publicKey) should be obtained from VDR */
  var keyPair = await genBlsKeyPair();
  String blsPublicKey = keyPair["publicKey"];
  String blsSecretKey = keyPair["secretKey"];

  print("----------------------------------------");
  print("1. keyPair should be obtained from VDR");
  print("publicKey");
  print(blsPublicKey);
  print("");
  print("secretKey");
  print(blsSecretKey);
  print("\n\n");

  print("----------------------------------------");
  print("2. publicKey should be registerd into vdr");
  var exponent;
  String jwkSet = json.encode({
    "keys": [
      jwkFromRsaPublicKey(rsaPublicKey),
      {"kty": "OKP", "crv": "Bls12381G2", "x": blsPublicKey}
    ]
  });
  var didResult = await createDid(jwkSet);
  pprint(didResult);
  String rsaKid = didResult["keys"][0]["kid"];
  String blsKid = didResult["keys"][1]["kid"];
  print("rsaKeyID = $rsaKid");
  print("blsKeyID = $blsKid");
  print("\n\n");

  VerifiableCredential VC_ = VerifiableCredential(VC);
  //print(VC_.getMessages());
  print("----------------------------------------");
  print("3. VC will be divided into some parts");
  print("\n\n");
  for (var i = 0; i < VC_.messages.length; i++) {
    print("message $i");
    pprint(json.decode(VC_.messages[i]));
    print("\n\n");
  }

  /* signed VC */
  String signedVC = await vcCreate(VC, blsSecretKey, blsKid);
  print("----------------------------------------");
  print("4. VC will be signed by Issuer (VC create)");
  pprint(json.decode(signedVC));
  print("\n\n");

  /* get Options 
   user selects property from options in PLR app */
  List<String> options = getOptions(signedVC);
  print("----------------------------------------");
  print("5. PLR can get selective fields.");
  print("\n\n");
  for (var i = 0; i < options.length; i++) {
    print("field $i");
    pprint(json.decode(options[i]));
    print("\n\n");
  }
  print("\n\n");

  /* create VP */
  List<int> revealed = [1, 4];
  String VP = await vpCreate(signedVC, revealed, rsaPrivateKey, rsaKid);
  print("----------------------------------------");
  print("5. VP will be created with selective disclosure by Holder");
  pprint(json.decode(VP));
  print("\n\n");

  /* verify VP */
  bool result1 = await vpVerify(VP);
  print("----------------------------------------");
  print("6. VP will be verified by Verifier");
  print(result1);
}
