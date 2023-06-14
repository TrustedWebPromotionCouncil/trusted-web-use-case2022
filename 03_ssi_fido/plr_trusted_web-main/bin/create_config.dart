import 'dart:convert' show JsonEncoder;

import 'package:dart_bbs/dart_bbs.dart' show genBlsKeyPair, createDid;
import 'package:jose/jose.dart';
import 'package:plr_trusted_web/plr_trusted_web.dart';

void main() async {
  JsonWebKeySet keySet; {
    JsonWebKey rsaKey; {
      var keyPair = JsonWebKey.generate("RS256").cryptoKeyPair;
      // Supress unnecessary fields.
      rsaKey = JsonWebKey.fromCryptoKeys(
        publicKey: keyPair.publicKey,
        privateKey: keyPair.privateKey,
      );
    }
    JsonWebKey blsKey; {
      var blsKeyPair = await genBlsKeyPair();
      blsKey = JsonWebKey_Bls.fromJson({
          "kty": bbsX.type,
          "crv": bbsX.curve,
          "x": blsKeyPair["publicKey"],
          "d": blsKeyPair["secretKey"],
      });
    }
    keySet = JsonWebKeySet_Bls.fromKeys([ rsaKey, blsKey ]);
  }
  keySet = await register(keySet);

  print(const JsonEncoder.withIndent("  ").convert(keySet.toJson()));
}

Future<JsonWebKeySet> register(JsonWebKeySet keySet) async {
  var resultKeySet = JsonWebKeySet_Bls.fromJson(
    await createDid(const JsonEncoder().convert(_toPublicKeysJson(keySet))),
  );

  var resultKeyMap = Map.fromIterable(
    resultKeySet.keys, key: (k) => k.cryptoKeyPair.publicKey,
  );

  return JsonWebKeySet_Bls.fromJson({
    "id": resultKeySet["id"],
    "keys": keySet.keys.map((k) {
        var r = resultKeyMap[k.cryptoKeyPair.publicKey];
        if (r == null) throw StateError(
          "VDR registration result does not contains key for ${k.keyType}.",
        );
        return {...k.toJson()}..["kid"] = r.keyId;
    }).toList(),
  });
}

Map<String, dynamic> _toPublicKeysJson(
  JsonWebKeySet keySet,
) => JsonWebKeySet_Bls.fromKeys(
  keySet.keys.map(
    (k) => JsonWebKey_Bls.fromCryptoKeys(
      publicKey: ArgumentError.checkNotNull(
        k.cryptoKeyPair.publicKey, "keys(${k.keyType}).publicKey",
      ),
    ),
  ),
).toJson();
