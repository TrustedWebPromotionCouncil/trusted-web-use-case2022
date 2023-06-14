import 'dart:convert';

import 'package:dart_bbs/src/bls_signature/bls_settings.dart';
import 'package:http/http.dart' as http;

/* Interface
 input  : publickey String
        : messages String[]
        : signature(proofValue) String

 output : verifiedResult Bool 
*/

Future<bool> blsVerify(
    String publicKey, List<String> messages, String signature) async {
  var response = await http.post(
    blsVerifyUri,
    body: json.encode({
      "signature": signature,
      "publicKey": publicKey,
      "messages": messages,
    }),
    headers: {"Content-Type": "application/json"},
  );
  return json.decode(response.body)["is_verified"]["verified"];
}
