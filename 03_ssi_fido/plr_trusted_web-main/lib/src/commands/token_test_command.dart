import 'dart:convert';
import 'dart:io' show File, stdin, stdout;

import 'package:jose/jose.dart';

import '../command.dart';
import '../token/api.dart';

final _jsonFormatter = const JsonEncoder.withIndent("  ").convert;

class TokenTestCommand extends Command {
  TokenTestCommand(super.parser, super.results, super.appResults);

  int? _parseSecondsOption(String name) {
    var value = results[name];
    if (value == null) return null;

    var i = int.tryParse(value);
    if ((i != null) && (i >= 0)) return i;

    print("Could not parse the ${name} seconds: ${value}");
    return null;
  }

  @override
  Future<void> call() async {
    String issuer;
    JsonWebKey key; {
      var _config = await config;
      issuer = _config.id;
      key = _config.rsaKey;
    }

    var subject = results["create"];
    var file = results["verify"];
    if ((subject == null) && (file == null)) {
      print("Please specify one of create or verify options.");
      return;
    }
    if ((subject != null) && (file != null)) {
      print("Cannot specify both create and verify options.");
      return;
    }

    if (subject != null) {
      var expirationTime = _parseSecondsOption("expirationTime");
      if (expirationTime == null) return;
      var notBefore = _parseSecondsOption("notBefore");
      var jwtId = results["jwtId"];
      var authenticationContext = results["authenticationContext"];

      await _create(
        issuer, subject, expirationTime, notBefore, jwtId,
        authenticationContext, key,
      );
    }
    if (file != null) await _verify(file, issuer, key);
  }

  Future<void> _create(
    String issuer,
    String subject,
    int expirationTime,
    int? notBefore,
    String? jwtId,
    String authenticationContext,
    JsonWebKey key,
  ) async {
    var jwt = createToken(
      issuer: issuer,
      subject: subject,
      audience: fidoNotary,
      expirationTime: expirationTime,
      notBefore: notBefore,
      jwtId: jwtId,
      authenticationContext: authenticationContext,
      key: key,
    );

    print("Compact Serialization:");
    print("${jwt.toCompactSerialization()}");

    print("===");

    print("Common Header:");
    print(_jsonFormatter(jwt.commonHeader.toJson()));

    print("---");

    print("Payload:");
    print(_jsonFormatter(jwt.unverifiedPayload.jsonContent));
  }

  Future<void> _verify(String file, String issuer, JsonWebKey key) async {
    String content; switch (file) {
      case "-": content = (
        await stdin.transform(utf8.decoder).fold<StringBuffer>(
          StringBuffer(), (p, e) => p..write(e),
        )
      ).toString(); break;

      default: content = await File(file).readAsString();
    }
    content = content.trim();

    JsonWebToken jwt; try {
      jwt = JsonWebToken.unverified(content);
    } on FormatException catch (_) {
      print("Invalid JWT format.");
      return;
    }

    var claims = jwt.claims;
    print("Claims:");
    print(_jsonFormatter(claims));

    print("===");

    stdout.write("Verification result: ");

    if (claims.issuer.toString() != issuer) {
      print("failed - different issuer.");
      return;
    }

    var now = DateTime.now();
    if (claims.expiry?.isAfter(now) == false) {
      print("failed - token expired.");
      return;
    }
    if (claims.notBefore?.isBefore(now) == false) {
      print("failed - token not yet valid.");
      return;
    }

    var result = await jwt.verify(JsonWebKeyStore()..addKey(key));
    print(result ? "succeed." : "failed - invalid signature.");
  }
}
