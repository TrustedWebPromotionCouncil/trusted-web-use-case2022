import 'dart:convert';

import 'package:dart_bbs/src/bls_signature/bls_settings.dart';
import 'package:http/http.dart' as http;

/* Interface
 input  : VP String

 output : verifiedResult Bool 
*/

Future<bool> blsVerifyProof(proof, publicKey, messages, nonce) async {
  var response = await http.post(blsVerifyProofUri,
      body: json.encode({
        "proof": proof,
        "publicKey": publicKey,
        "messages": messages,
        "nonce": nonce
      }),
      headers: {"Content-Type": "application/json"});

  return json.decode(json.decode(response.body)["isProofVerified"])["verified"];
}
