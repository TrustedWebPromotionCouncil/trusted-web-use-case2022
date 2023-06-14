import 'dart:convert';

import 'package:dart_bbs/src/bls_signature/bls_settings.dart';
import 'package:http/http.dart' as http;

// input  :
//
// output : keyPair

Future<Map> genBlsKeyPair() async {
  var response = await http
      .get(genBlsKeyPairUri, headers: {"Content-Type": "application/json"});

  Map ret = json.decode(response.body)["keyPair"];

  // VDR
  ret["id"] = "did:";
  return ret;
}
