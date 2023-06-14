import 'dart:typed_data';
import 'package:dart_bbs/src/utils/convert_uint8list.dart';
import "package:pointycastle/export.dart";

String rsaSign(RSAPrivateKey privateKey, String dataToSign) {
  Uint8List dataToSign_ = convertStringToUint8List(dataToSign);
  final signer = RSASigner(SHA256Digest(), '0609608648016503040201');

  // initialize with true, which means sign
  signer.init(true, PrivateKeyParameter<RSAPrivateKey>(privateKey));

  final sig = signer.generateSignature(dataToSign_);

  return convertUint8ListToString(sig.bytes);
}
