import 'dart:convert';

import 'package:http/http.dart' as http;
import 'package:dart_bbs/src/vdr/vdr_settings.dart';

/* Interface
 input  : kid String

 output : keyValue String
*/

Future<String> retrieveBlsKeyValue(String kid) async {
  var response = await http.post(vdrRetrieveKeyUri,
      body: json.encode({"kid": kid}),
      headers: {"Content-Type": "application/json"});

  return json.decode(response.body)["x"];
}
