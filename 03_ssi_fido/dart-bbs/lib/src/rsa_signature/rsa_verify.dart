import 'dart:convert';
import 'dart:typed_data';
import 'package:dart_bbs/src/utils/convert_uint8list.dart';
import "package:pointycastle/export.dart";

bool rsaVerify(RSAPublicKey publicKey, String signedData, String signature) {
  Uint8List signedData_ = convertStringToUint8List(signedData);

  final sig = RSASignature(base64.decode(signature));

  final verifier = RSASigner(SHA256Digest(), '0609608648016503040201');

  // initialize with false, which means verify
  verifier.init(false, PublicKeyParameter<RSAPublicKey>(publicKey));

  try {
    return verifier.verifySignature(signedData_, sig);
  } on ArgumentError {
    return false; // for Pointy Castle 1.0.2 when signature has been modified
  }
}
