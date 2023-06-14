import 'dart:convert';

import 'package:dart_bbs/src/vdr/retrieve_key.dart';
import 'package:pointycastle/pointycastle.dart';

List<int> _base64ToBytes(String encoded) {
  encoded += List.filled((4 - encoded.length % 4) % 4, '=').join();
  return base64Url.decode(encoded);
}

BigInt _base64ToInt(String encoded) {
  final b256 = BigInt.from(256);
  return _base64ToBytes(encoded)
      .fold(BigInt.zero, (a, b) => a * b256 + BigInt.from(b));
}

String _bytesToBase64(List<int> bytes) {
  return base64Url.encode(bytes).replaceAll('=', '');
}

String _intToBase64(BigInt v) {
  var s = v.toRadixString(16);
  if (s.length % 2 != 0) s = '0$s';

  return _bytesToBase64(s
      .replaceAllMapped(RegExp('[0-9a-f]{2}'), (m) => '${m.group(0)},')
      .split(',')
      .where((v) => v.isNotEmpty)
      .map((v) => int.parse(v, radix: 16))
      .toList());
}

Map jwkFromRsaPublicKey(RSAPublicKey pk) {
  return {
    "kty": "RSA",
    "n": _intToBase64(pk.n!),
    "e": _intToBase64(pk.exponent!)
  };
}

Future<RSAPublicKey> retrieveRsaKeyFromVDR(String kid) async {
  Map jwk = await retrieveKey(kid);
  return RSAPublicKey(_base64ToInt(jwk["n"]), _base64ToInt(jwk["e"]));
}
