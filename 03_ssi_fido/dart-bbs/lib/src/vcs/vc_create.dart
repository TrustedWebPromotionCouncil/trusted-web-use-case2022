import 'dart:convert';
import 'package:dart_bbs/src/bls_signature/bls_sign.dart';
import 'package:dart_bbs/src/models/vc.dart';
import 'package:dart_bbs/src/utils/get_date.dart';
import 'package:dart_bbs/src/bls_signature/retrieve_bls_key_value.dart';

// input  : VC
//        : issuerSecretKey
//        : kid(issuer's)
//
// output : signedVC

Future<String> vcCreate(VC, issuerSecretKey, kid) async {
  Map VC1 = json.decode(VC);
  VC1["issuanceDate"] = getDate();

  VerifiableCredential VC_ = VerifiableCredential(json.encode(VC1));


  List<String> messages = VC_.messages;
  String publicKey = await retrieveBlsKeyValue(kid);

  String proofValue = await blsSign(publicKey, issuerSecretKey, messages);

  /* createProof */
  var proof = {
    "type": "BbsBlsSignatureProof2020",
    "created": getDate(),

    "verificationMethod": kid,
    "proofPurpose": "assertionMethod",
    "proofValue": proofValue,
  };

  /* createVC */
  Map signedVC = VC_.mapVC;
  signedVC["proof"] = proof;

  return json.encode(signedVC);
}
