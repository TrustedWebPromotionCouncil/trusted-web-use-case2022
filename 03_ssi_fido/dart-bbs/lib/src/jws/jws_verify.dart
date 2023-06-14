import 'package:dart_bbs/src/bls_signature/bls_verify.dart';
import 'package:dart_bbs/src/models/jws.dart';

const _jwsHeaderTypeKey = "typ";
const _jwsTypeJWT = "JWT";

const _jwtExpirationTimeKey = "exp";
const _jwtNotBeforeKey = "nbf";

// input  : JWS Compact Serialization String
//          publicKey String
//
// output : result Bool

Future<bool> jwsVerify(String compactSerialization, String publicKey) async {
  var jws = JsonWebSignature.fromCompactSerialization(compactSerialization);
  if (!_checkJWTValidity(jws)) return false;

  return await blsVerify(publicKey, [jws.payloadDecoded], jws.signature);
}

bool _checkJWTValidity(JsonWebSignature jws) {
  var jwt = _mayExtractJWT(jws);
  if (jwt == null) return true;

  var now = DateTime.now();

  var dt = _getJWTDateTime(jwt, _jwtExpirationTimeKey);
  if ((dt != null) && now.isAfter(dt)) return false;

  dt = _getJWTDateTime(jwt, _jwtNotBeforeKey);
  if ((dt != null) && now.isBefore(dt)) return false;

  return true;
}

DateTime? _getJWTDateTime(Map<String, dynamic> jwt, String key) {
  var v = jwt[key];
  if (v is! num) return null;

  return DateTime.fromMillisecondsSinceEpoch(v.round() * 1000);
}

Map<String, dynamic>? _mayExtractJWT(JsonWebSignature jws) {
  var type = jws.protectedHeaderJson[_jwsHeaderTypeKey];
  if ((type != null) && (type != _jwsTypeJWT)) return null;

  return jws.payloadJson;
}
