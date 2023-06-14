import 'dart:convert';

import 'package:dart_bbs/src/models/vp.dart';

import 'package:dart_bbs/src/vcs/vp_selective_disclosed.dart';

// input  : VC        String
//          revealed  List<int>
//          holderSecretKey
//          kid (holder's)
//
// output : VP String

Future<String> vpCreate(signedVC, revealedIndices, holderSecretKey, kid) async {
  var selectiveDislosedVC =
      await vpSelectiveDisclosed(signedVC, revealedIndices);

  var VP = VerifiablePresentation(selectiveDislosedVC);
  return VP.export(holderSecretKey, kid);
}
