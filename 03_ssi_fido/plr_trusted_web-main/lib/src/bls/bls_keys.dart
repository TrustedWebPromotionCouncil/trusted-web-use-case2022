import 'package:crypto_keys/crypto_keys.dart';

Never _throwUnsupportedError() => throw UnsupportedError(
  "Unsupported in BlsPublicKey.",
);

abstract class BlsKey extends Key {
  final String key;
  BlsKey({ required this.key });

  Encrypter createEncrypter(Identifier algorithm) => _throwUnsupportedError();

  @override
  int get hashCode => key.hashCode;

  @override
  bool operator ==(Object other) =>
    identical(this, other) || ((other is BlsPublicKey) && other.key == key);
}

class BlsPublicKey extends BlsKey implements PublicKey {
  BlsPublicKey({ required super.key });

  Verifier createVerifier(Identifier algorithm) => _throwUnsupportedError();

}

class BlsPrivateKey extends BlsKey implements PrivateKey {
  BlsPrivateKey({ required super.key });

  Signer createSigner(Identifier algorithm) => _throwUnsupportedError();
}
