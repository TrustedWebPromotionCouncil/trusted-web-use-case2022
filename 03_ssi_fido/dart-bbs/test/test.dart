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
      "https://purl.imsglobal.org/spec/ob/v3p0/context.json"
    ],
    "type": ["VerifiableCredential", "OpenBadgeCredential"],
    "credentialSubject": [
      {"id": "did:example:40", "type": "Profile", "name": "池本 昌弘"},
      {"id": "did:example:40", "type": "Profile", "dateOfBirth": "1991-05-27"},
      {"id": "did:example:40", "type": "Profile", "sex": "female"},
      {
        "id": "did:example:40",
        "type": "AchievementSubject",
        "creditsEarned": 2.9,
        "result": {"achievedLevel": "D"},
        "achievement": {
          "type": "Course",
          "name": "Compiler Construction",
          "description": "The description for Compiler Construction"
        }
      },
      {
        "id": "did:example:40",
        "type": "AchievementSubject",
        "creditsEarned": 3.9,
        "result": {"achievedLevel": "D"},
        "achievement": {
          "type": "Course",
          "name": "Linear Algebra",
          "description": "The description for Linear Algebra"
        }
      },
      {
        "id": "did:example:40",
        "type": "AchievementSubject",
        "creditsEarned": 3.1,
        "result": {"achievedLevel": "F"},
        "achievement": {
          "type": "Course",
          "name": "Machine Learning I",
          "description": "The description for Machine Learning I"
        }
      }
    ],
    "issuer": {
      "id": "did:example:21",
      "type": "Profile",
      "name": "The University of Tokyo"
    },
    "issuanceDate": "2023-02-07T07:32:22.977724Z",
    "name": "Transcript"
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
