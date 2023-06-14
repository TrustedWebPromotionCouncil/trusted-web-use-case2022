import 'dart:convert' show json;

import 'package:dart_bbs/dart_bbs.dart';
import 'package:dart_bbs/src/utils/pprint.dart';

void main() async {
  String publicKey, secretKey;
  {
    var keyPair = await genBlsKeyPair();
    publicKey = keyPair["publicKey"];
    secretKey = keyPair["secretKey"];
  }

  var now = DateTime.now().millisecondsSinceEpoch ~/ 1000;

  var payload = json.encode({
    "sub": "plr:googleDrive:example@gmail.com:20230112114530_P9x",
    "iss": "did:example:issuer",
    "aud": "https://example_fido.com",
    "iat": now,
    "exp": now + (60 * 60), // 1 hour.
    "authnCtx": "plr"
  });

  print("----------------------------------------");
  print("1. keyPair should be obtained from VDR");
  print("publicKey");
  print(publicKey);
  print("");
  print("secretKey");
  print(secretKey);
  print("\n\n");

  print("----------------------------------------");
  print("2. JWS payload");
  pprint(json.decode(payload));
  print("\n\n");

  /* signed JWS */
  var jws = await jwsCreate(payload, secretKey, publicKey);
  print("----------------------------------------");
  print("3. JWS Compact Serialization");
  print(jws);
  print("\n\n");

  /* verify JWS */
  var result = await jwsVerify(jws, publicKey);
  print("----------------------------------------");
  print("4. JWS will be verified by Verifier");
  print(result);
}
