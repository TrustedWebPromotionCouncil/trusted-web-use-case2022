import 'dart:convert';

import 'package:dart_bbs/src/models/vc.dart';

List<String> getOptions(signedVC) {
  VerifiableCredential signedVC_ = VerifiableCredential(signedVC);
  List<String> options = signedVC_.getSelectiveFields();
  List<String> ret = [];
  for (var i = 0; i < options.length; i++) {
    Map<String, dynamic> mapOption = json.decode(options[i]);
    mapOption["revealedIndex"] = i + 1;
    ret.add(json.encode(mapOption));
  }
  return ret;
}
