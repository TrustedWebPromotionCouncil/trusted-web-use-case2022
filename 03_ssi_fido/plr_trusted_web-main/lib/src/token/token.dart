import 'package:jose/jose.dart';

import 'vocab.dart';

const defaultTokenExpirationTime = 60 * 60 * 1;
const defaultAuthenticationContext = "PLR";

/// 署名済のJWT(JWS)を生成します。
JsonWebSignature createToken({
    String? issuer,
    String? subject,
    String? audience,
    int? expirationTime,
    int? notBefore,
    bool useIssuedAt = true,
    String? jwtId,
    String? authenticationContext,
    required JsonWebKey key,
}) {
  JsonWebTokenClaims claims; {
    var issuedAt = DateTime.now().millisecondsSinceEpoch ~/ 1000;
    claims = JsonWebTokenClaims.fromJson({
        if (issuer != null) jwtIssuerKey: issuer,
        if (subject != null) jwtSubjectKey: subject,
        if (audience != null) jwtAudienceKey: audience,
        if (expirationTime != null)
          jwtExpirationTimeKey: issuedAt + expirationTime,
        if (notBefore != null) jwtNotBeforeKey: issuedAt + notBefore,
        if (useIssuedAt) jwtIssuedAtKey: issuedAt,
        if (jwtId != null) jwtIdKey: jwtId,
        if (authenticationContext != null)
          twAuthenticationContextKey: authenticationContext,
    });
  }

  var builder = JsonWebSignatureBuilder()
    ..setProtectedHeader(jwsType, "JWT")
    ..jsonContent = claims.toJson()
    ..addRecipient(key);

  return builder.build();
}
