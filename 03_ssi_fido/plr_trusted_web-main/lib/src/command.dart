import 'dart:convert' show json;
import 'dart:io' as io;

import 'package:args/args.dart';
import 'package:crypto_keys/crypto_keys.dart';
import 'package:collection/collection.dart' show IterableExtension;
import 'package:jose/jose.dart' show JsonWebKey;
import 'package:plr_console/plr_console.dart';

import 'bls/api.dart';
import 'commands/storage_command.dart';
import 'db/api.dart';

export 'bls/api.dart';
export 'commands/daemon_command.dart';
export 'commands/storage_command.dart';
export 'commands/token_test_command.dart';

class Config extends JsonWebKeySet_Bls {
  Config.fromJson(Map<String, dynamic> json) : super.fromJson(json);

  String get id => ArgumentError.checkNotNull(this["id"], "config.id");

  JsonWebKey? _keyOf(String keyType) => keys.firstWhereOrNull(
    (k) => k.keyType == keyType,
  );

  JsonWebKey? _rsaKey;
  JsonWebKey get rsaKey => ArgumentError.checkNotNull(
    _rsaKey ??= _keyOf("RSA"), "config.rsaKey",
  );

  String get rsaKeyId => ArgumentError.checkNotNull(
    rsaKey.keyId, "config.rsaKey.keyId",
  );

  RsaPublicKey get rsaPublicKey => ArgumentError.checkNotNull(
    rsaKey.cryptoKeyPair.publicKey as RsaPublicKey?,
    "config.rsaKey.publicKey",
  );

  RsaPrivateKey get rsaPrivateKey => ArgumentError.checkNotNull(
    rsaKey.cryptoKeyPair.privateKey as RsaPrivateKey?,
    "config.rsaKey.privateKey",
  );

  JsonWebKey get blsKey => ArgumentError.checkNotNull(
    _keyOf(bbsX.type), "config.blsKey",
  );

  String get blsKeyId => ArgumentError.checkNotNull(
    blsKey.keyId, "config.blsKey.keyId",
  );

  BlsPublicKey get blsPublicKey => ArgumentError.checkNotNull(
    blsKey.cryptoKeyPair.publicKey as BlsPublicKey?,
    "config.blsKey.publicKey",
  );

  BlsPrivateKey get blsPrivateKey => ArgumentError.checkNotNull(
    blsKey.cryptoKeyPair.privateKey as BlsPrivateKey?,
    "config.blsKey.privateKey",
  );
}

abstract class Command {
  final ArgParser parser;
  final ArgResults results, appResults;

  Command(this.parser, this.results, this.appResults);

  String? get passphrase => appResults["passphrase"];

  String get fidoNotary => appResults["fidoNotary"]!;

  JsonWebKey? _fidoNotaryKey;

  Future<JsonWebKey> get fidoNotaryKey async =>
    _fidoNotaryKey ??= JsonWebKey.fromJson(
      json.decode(await io.File(appResults["fidoNotaryKey"]!).readAsString()),
    );

  Config? _config;
  Future<Config> get config async => _config ??= Config.fromJson(
    json.decode(await io.File(appResults["config"]!).readAsString()),
  );

  UserDatabase? _userDatabase;
  UserDatabase get userDatabase => _userDatabase ??= UserDatabase(
    io.File(appResults["userDatabase"]!),
  );

  String get issuerName => appResults["issuerName"]!;

  Future<void> call();

  void showUsage() {
    print("");
    print("Invalid arguments.");
    print("");
    print("${results.name} options:");
    print(parser.usage);
  }

  Future<void> withStorage(
    String storageId,
    Future<void> function(Storage storage, Root root),
  ) async {
    var storage = await connect(storageId, passphrase);
    if (storage == null) return;

    print("");
    return function(storage, await rootOf(storage));
  }
}

TextSearchCondition? readSearchCondition(String name) {
  io.stdout.write("${name} pattern: ");
  var line = io.stdin.readLineSync();
  if ((line = line?.trim())?.isNotEmpty != true) return null;

  var word = line!;

  var matchMethod;
  while (true) {
    io.stdout.write(
      "${name} match (" +
      MatchMethod.values.map(
        (mm) => "${mm.index}: ${mm.toString().split(".")[1]}",
      ).join(", ") +
      "): ",
    );
    line = io.stdin.readLineSync();

    if ((line = line?.trim())?.isNotEmpty != true) line = "0";
    var m = int.tryParse(line!);
    if ((m == null) || (m < 0) || (m >= MatchMethod.values.length)) continue;

    matchMethod = MatchMethod.values[m];
    break;
  }
  return TextSearchCondition(word, matchMethod);
}

Iterable<IdNameSearchCondition> readIdNameSearchConditions(String name) {
  var conditions = <IdNameSearchCondition>[];
  while (true) {
    var idCond = readSearchCondition("${name} PLR-ID");
    var nameCond = readSearchCondition("${name} Name");
    if ((idCond == null) && (nameCond == null)) break;

    conditions.add(IdNameSearchCondition(idCond, nameCond));
  }
  return conditions;
}
