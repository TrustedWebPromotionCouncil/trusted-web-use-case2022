import 'dart:convert';

import 'package:http/http.dart' as http;
import 'package:dart_bbs/src/vdr/vdr_settings.dart';

/* Interface
 input  : kid String

 output : jwk Map 
*/

Future<Map<String, dynamic>> retrieveKey(String kid) async {
  var response = await http.post(vdrRetrieveKeyUri,
      body: json.encode({"kid": kid}),
      headers: {"Content-Type": "application/json"});

  return json.decode(response.body);
}
