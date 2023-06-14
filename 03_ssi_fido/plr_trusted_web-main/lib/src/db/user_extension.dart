import 'dart:convert' show utf8;
import 'dart:typed_data' show Uint8List;

import 'package:pointycastle/export.dart' show SHA256Digest;

import 'user_database.dart' show User;

enum Sex {
  male, female,
}

enum AchievedLevel {
  S, A, B, C, D, F;
}

class Achievement {
  final String name;
  final String description;
  final double creditsEarned;
  final AchievedLevel achievedLevel;
  const Achievement(
    this.name, this.description, this.creditsEarned, this.achievedLevel,
  );
}

const _cources = [
  "Compiler Construction",
  "Linear Algebra",
  "Machine Learning I",
];

final _digest = SHA256Digest();

extension UserInfo on User {
  Uint8List get _hash {
    var hash = Uint8List(_digest.digestSize); {
      var bytes = Uint8List.fromList(utf8.encode(email));
      _digest..reset()..update(bytes, 0, bytes.length)..doFinal(hash, 0);
    }
    return hash;
  }

  DateTime get dateOfBirth {
    var hash = _hash;

    var i = 0;
    return DateTime(
      1990 + (hash[i++] % 20), (hash[i++] % 12) + 1, (hash[i++] % 28) + 1,
    );
  }

  Sex get sex => Sex.values[_hash[3] % 2];

  Iterable<Achievement> get achievements sync* {
    var hash = _hash;

    var i = 8;
    for (var c in _cources) {
      var creditsEarned = ((hash[i++] / 51) * 10).round() / 10;
      var achievedLevel =
        AchievedLevel.values[hash[i++] % AchievedLevel.values.length];
      yield Achievement(
        c, "The description for ${c}", creditsEarned, achievedLevel,
      );
    }
  }
}
