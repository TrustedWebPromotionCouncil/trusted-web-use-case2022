import 'dart:convert';
import 'package:dart_bbs/src/rsa_signature/rsa_sign.dart';
import 'package:dart_bbs/src/utils/get_date.dart';

class VerifiablePresentation {
  Map body = {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://www.w3.org/2018/credentials/examples/v1"
    ],
    "type": "VerifiablePresentation",
    "verifiableCredential": []
  };

  VerifiablePresentation(vc) {
    body["verifiableCredential"] = [vc];
  }

  void createProof(holderPrivateKey, kid) {
    String signature = rsaSign(holderPrivateKey, json.encode(body));
    var rsaProof = {
      "type": "RsaSignature2018",
      "created": getDate(),
      "verificationMethod": kid,
      "proofPurpose": "assertionMethod",
      "proofValue": signature,
    };
    body["proof"] = rsaProof;
  }

  String export(holderPrivateKey, kid) {
    createProof(holderPrivateKey, kid);
    return json.encode(body);
  }
}
