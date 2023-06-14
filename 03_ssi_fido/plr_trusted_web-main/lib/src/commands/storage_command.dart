import 'dart:io';

import 'package:plr_console/plr_console.dart';

import '../command.dart';

Future<Storage?> create(String typeName, String? passphrase) async {
  var type = storageTypeOf(typeName);
  if (!type.isRegistered) {
    print("Invalid storage-type: ${typeName}");
    return null;
  }

  stdout.write("Creating a new storage connection... ");
  var storage = await type.create(
    onNeedInitialPassphrase: () async {
      if (passphrase != null) {
        print("Use the passphrase specified by command line option.");
        return passphrase;
      }
      print("storage has no key pair or need to access root node.");
      if ((passphrase = _askNewPassphrase) != null) {
        stdout.write("Creating a new storage connection... ");
      }
      return passphrase;
    },
  );
  if (storage == null) return null;
  print("done.");

  print("Storage created: " + await formatStorage(storage));
  return _storageInitialized(storage, passphrase);
}

Future<Storage?> connect(String id, String? passphrase) async {
  var info = await _getStorageInfo(id);
  if (info == null) return null;

  stdout.write("Connecting to the storage... ");
  var storage = await info.connect();
  print("done.");

  print("Storage connected: " + await formatStorage(storage));
  if (passphrase != null) {
    print("Use the passphrase specified by command line option.");
  }
  return _storageInitialized(storage, passphrase);
}

String? get _askPassphrase => _noEchoInput("Enter passphrase: ");

String? get _askNewPassphrase {
  var passphrase, confirm; do {
    if ((passphrase = _noEchoInput("Enter new passphrase: ")) == null) {
      return null;
    }
    confirm = _noEchoInput("Confirm new passphrase: ");
  } while (passphrase != confirm);

  return passphrase;
}

Future<Storage?> _storageInitialized(
  Storage storage,
  String? passphrase,
) async {
  if (storage.isCipherInitialized) return storage;

  passphrase ??= _askPassphrase;
  while (true) {
    if (passphrase == null) return null;

    if (await storage.postPassphrase(passphrase)) {
      break;
    }
    print("Invalid passphrase.");
    passphrase = _askPassphrase;
  }
  return storage;
}

String? _noEchoInput(String message) {
  stdin.echoMode = false; try {
    var line; do {
      stdout.write(message);
      line = stdin.readLineSync();
      print("");
    } while (line?.isEmpty ?? false);
    return line;
  } finally {
    stdin.echoMode = true;
  }
}

Future<bool> remove(String id) async {
  var info = await _getStorageInfo(id);
  if (info == null) return false;

  stdout.write("Removing a storage... ");
  if (!await removeStorage(info)) {
    print("failed.");
    return false;
  }
  print("done.");

  print("Storage removed: " + formatStorageInfo(info));
  return true;
}

Future<StorageInfo?> _getStorageInfo(String idStr) async {
  var info; {
    var id = int.tryParse(idStr);
    if (id != null) info = await storageInfoOf(id);
  }
  if (info == null) {
    print("Invalid storage-id: ${idStr}");
    return null;
  }
  return info;
}

Future<String> formatStorage(Storage storage) async =>
  formatStorageInfo(await storage.info);

String formatStorageInfo(StorageInfo info) =>
  "${info.id}: ${info.type} - ${info.email}" +
  ((info.userName != null) ?" (${info.userName})" : "");


class StorageCommand extends Command {
  StorageCommand(super.parser, super.results, super.appResults);

  @override
  Future<void> call() async {
    if (results["types"]) _listTypes();
    else if (results["list"] == true) await _listRegisteredStorageInfos();
    else if (results["new"] != null) await create(results["new"], passphrase);
    else if (results["remove"] != null) await remove(results["remove"]);
  }

  void _listTypes() {
    print("Storage types:");
    for (var i in storageTypes) {
      print("  ${i.name}: ${i.displayName}");
    }
  }

  Future<void> _listRegisteredStorageInfos() async {
    print("Registered storages:");
    for (var i in await registeredStorageInfos) {
      print(
        "  ${i.id}: ${i.type.displayName} - ${i.email}" +
        ((i.userName != null) ? " (${i.userName})" : "")
      );
    }
  }
}
