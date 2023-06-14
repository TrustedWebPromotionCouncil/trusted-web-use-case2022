import 'dart:convert';

import 'package:dart_bbs/src/bls_signature/bls_settings.dart';
import 'package:http/http.dart' as http;

/* Interface
 input  : publickey String
        : secretkey String
        : messages String[]

 output : proofValue(Signature) String 
*/

Future<String> blsSign(pk, sk, messages) async {
  var response = await http.post(blsSignUri,
      body: json.encode({
        "pk": pk,
        "sk": sk,
        "messages": messages,
      }),
      headers: {"Content-Type": "application/json"});

  return json.decode(response.body)["proof"];
}
