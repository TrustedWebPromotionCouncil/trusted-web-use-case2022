import 'dart:io' show File;

import 'package:drift/drift.dart';
import 'package:drift/native.dart';

part 'user_database.g.dart';

class Users extends Table {
  IntColumn get id => integer().autoIncrement()();
  TextColumn get name => text()();
  TextColumn get email => text().unique()();
  TextColumn get fidoId => text().unique().nullable()();
  TextColumn get did => text().unique().nullable()();
}

@DriftDatabase(tables: [ Users ])
class UserDatabase extends _$UserDatabase {
  UserDatabase(File file): super(NativeDatabase.createInBackground(file));

  @override
  int get schemaVersion => 1;

  Future<User> createUser({
      required String name,
      required String email,
      String? fidoId,
      String? did,
  }) async => (
    await userById(
      await into(users).insert(
        UsersCompanion(
          name: Value(name),
          email: Value(email),
          fidoId: Value(fidoId),
          did: Value(did),
        ),
      ),
    )
  )!;

  Future<bool> updateUser(User user) => update(users).replace(user);

  Future<User?> userById(int id) => (
    select(users)..where((u) => u.id.equals(id))
  ).getSingleOrNull();

  Future<User?> userByEmail(String email) => (
    select(users)..where((u) => u.email.equals(email))
  ).getSingleOrNull();

  Future<User?> userByFidoId(String fidoId) => (
    select(users)..where((u) => u.fidoId.equals(fidoId))
  ).getSingleOrNull();

  Future<User?> userByDid(String did) => (
    select(users)..where((u) => u.did.equals(did))
  ).getSingleOrNull();
}
