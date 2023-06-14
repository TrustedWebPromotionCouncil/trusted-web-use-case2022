import 'dart:convert' as convert show base64;

import 'package:asn1lib/asn1lib.dart';
import 'package:crypto_keys/crypto_keys.dart';
import 'package:jose/jose.dart';
import 'package:jose/src/util.dart';
import 'package:x509/x509.dart' as x509;

import 'bls_keys.dart';

const bbsX = JsonWebAlgorithm(
  "BBS-X", type: "OKP", use: "sig", curve: "Bls12381G2",
);

Never _throwUnsupportedError() => throw UnsupportedError(
  "Unsupported in JsonWebKey_Bls.",
);

class JsonWebKey_Bls extends JsonObject implements JsonWebKey {
  final KeyPair _keyPair;
  JsonWebKey_Bls._fromJson(Map<String, dynamic> json): _keyPair = KeyPair(
    publicKey: (json["x"] != null) ? BlsPublicKey(key: json["x"]!) : null,
    privateKey: (json["d"] != null) ? BlsPrivateKey(key: json["d"]!) : null,
  ), super.from(json);

  static JsonWebKey fromJson(Map<String, dynamic> json) {
    if (json['kty'] == bbsX.type) return JsonWebKey_Bls._fromJson(json);
    return JsonWebKey.fromJson(json);
  }

  static JsonWebKey fromCryptoKeys({
    PublicKey? publicKey,
    PrivateKey? privateKey,
    String? keyId,
  }) {
    if (
      ((publicKey != null) || (privateKey != null)) &&
      ((publicKey is BlsPublicKey) || (privateKey is BlsPrivateKey))
    ) return fromJson({
        "kty": bbsX.type,
        "crv": bbsX.curve,
        if (publicKey != null) "x": (publicKey as BlsPublicKey).key,
        if (privateKey != null) "d": (publicKey as BlsPrivateKey).key,
        if (keyId != null) "kid": keyId,
    });
    return JsonWebKey.fromCryptoKeys(
      publicKey: publicKey, privateKey: privateKey, keyId: keyId,
    );
  }

  @override
  KeyPair get cryptoKeyPair => _keyPair;

  @override
  String get keyType => this['kty'];

  @override
  String? get publicKeyUse => this['use'];

  @override
  Set<String>? get keyOperations => getTypedList<String>('key_ops')?.toSet();

  @override
  String? get algorithm => this['alg'];

  @override
  String? get keyId => this['kid'];

  @override
  Uri? get x509Url => this['x5u'] == null ? null : Uri.parse(this['x5u']);

  @override
  List<x509.X509Certificate>? get x509CertificateChain =>
      (this['x5c'] as List?)?.map((v) {
        var bytes = convert.base64.decode(v);
        var p = ASN1Parser(bytes);
        var o = p.nextObject();
        if (o is! ASN1Sequence) {
          throw FormatException('Expected SEQUENCE, got ${o.runtimeType}');
        }
        var s = o;
        return x509.X509Certificate.fromAsn1(s);
      }).toList();

  @override
  String? get x509CertificateThumbprint => this['x5t'];

  @override
  String? get x509CertificateSha256Thumbprint => this['x5t#S256'];

  @override
  List<int> sign(List<int> data, {String? algorithm}) =>
    _throwUnsupportedError();

  @override
  bool verify(List<int> data, List<int> signature, {String? algorithm}) =>
    _throwUnsupportedError();

  @override
  EncryptionResult encrypt(List<int> data,
      {List<int>? initializationVector,
      List<int>? additionalAuthenticatedData,
      String? algorithm}) => _throwUnsupportedError();

  @override
  List<int> decrypt(List<int> data,
      {List<int>? initializationVector,
      List<int>? authenticationTag,
      List<int>? additionalAuthenticatedData,
      String? algorithm}) => _throwUnsupportedError();

  @override
  List<int> wrapKey(JsonWebKey key, {String? algorithm}) =>
    _throwUnsupportedError();

  @override
  JsonWebKey unwrapKey(List<int> data, {String? algorithm}) =>
    _throwUnsupportedError();

  @override
  bool usableForAlgorithm(String algorithm) => (
    ((this.algorithm == null) || (algorithm == bbsX.name)) &&
    (keyType == bbsX.type)
  );

  @override
  bool usableForOperation(String operation) => false;

  @override
  String? algorithmForOperation(String operation) => null;
}

class JsonWebKeySet_Bls extends JsonWebKeySet {
  @override
  List<JsonWebKey> get keys =>
      getTypedList<JsonWebKey>('keys', factory: (v) => JsonWebKey_Bls.fromJson(v)) ?? const [];

  factory JsonWebKeySet_Bls.fromKeys(Iterable<JsonWebKey> keys) =>
      JsonWebKeySet_Bls.fromJson({'keys': keys.map((v) => v.toJson()).toList()});

  JsonWebKeySet_Bls.fromJson(Map<String, dynamic> json) : super.fromJson(json);
}
