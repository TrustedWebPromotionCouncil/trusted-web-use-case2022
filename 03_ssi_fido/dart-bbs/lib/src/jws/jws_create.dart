import 'package:dart_bbs/src/bls_signature/bls_sign.dart';
import 'package:dart_bbs/src/models/jws.dart';

// input  : JWS Payload
//
// output : result JWS Compact Serialization

Future<String> jwsCreate(
  String payload,
  String secretKey,
  String publicKey,
) async {
  JsonWebSignature jws;
  {
    var proofValue = await blsSign(publicKey, secretKey, [payload]);
    jws = JsonWebSignature.fromContents(
      payloadString: payload,
      signature: proofValue,
    );
  }
  return jws.toCompactSerialization();
}
