import 'dart:convert';

import 'package:dart_bbs/src/bls_signature/bls_settings.dart';
import 'package:http/http.dart' as http;

/* Interface
 input  : signature String
        : publickey String
        : messages String[]
        : revealed Number[]
        : nonce string

 output : proof value 
*/

Future<String> blsCreateProof(
    signature, publicKey, messages, revealed, nonce) async {
  var response = await http.post(blsCreateProofUri,
      body: json.encode({
        "signature": signature,
        "publicKey": publicKey,
        "revealed": revealed,
        "messages": messages,
        "nonce": nonce
      }),
      headers: {"Content-Type": "application/json"});

  return json.decode(response.body)["proof"];
}
