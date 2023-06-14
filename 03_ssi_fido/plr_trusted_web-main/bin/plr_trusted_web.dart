import 'dart:io' show Platform;

import "package:args/args.dart";
import 'package:plr_console/worker_daemon.dart';
import 'package:plr_trusted_web/plr_trusted_web.dart';
import 'package:sprintf/sprintf.dart';

void main(List<String> args) async {
  var command = await _parseArguments(args);
  if (command == null) return;

  try {
    await command();
  } catch (e, s) {
    print(e);
    print(s);
  }
  print("Exiting...");
}

String get _script => Platform.script.pathSegments.last;
String get _scriptName => _script.replaceFirst(RegExp(r"\.dart$"), "");

Future<Command?> _parseArguments(List<String> args) async {
  var parser = _parser;
  ArgResults? results; try {
    results = parser.parse(args);
  } on ArgParserException catch (e) {
    if (!args.isEmpty && !args.contains("-h") && !args.contains("--help")) {
      print("${_scriptName}: ${e.message}\n");
    }
    _showUsage(parser);
  } catch (e, s) {
    print(e);
    print(s);
  }
  if (results == null) return null;

  await initPlr({ plrDirectoryParam: results["plr-directory"] });

  var commandResults = results.command;
  ArgParser? commandParser;
  if (commandResults != null) {
    commandParser = parser.commands[commandResults.name];
  }

  if (
    (commandParser == null) || results["help"] ||
    !_checkCommandArguments(commandParser, commandResults!)
  ) {
    _showUsage(parser, commandResults, commandParser);
    return null;
  }
  return commandParser.runner!(commandParser, commandResults, results);
}

void _showUsage(
  ArgParser parser, [
    ArgResults? commandResults,
    ArgParser? commandParser,
]) {
  print("Usage: ${_script} [common options] command [command options]\n");

  print("common options:");
  print(parser.usage);

  void showCommandUsage(String name, ArgParser commandParser) {
    print("\n${name} options:");
    print(commandParser.usage);
  }

  if (commandParser == null) {
    print("commands:");
    parser.commands.forEach((String name, ArgParser command) {
        print(sprintf("%-07s - %s", [ name, command.help ]));
    });
    for (var e in parser.commands.entries) {
      showCommandUsage(e.key, e.value);
    }
  } else showCommandUsage(commandResults!.name!, commandParser);
}

bool _checkCommandArguments(ArgParser parser, ArgResults results) {
  for (var n in parser.options.keys) {
    if ((results[n] != null) && ((results[n] is! bool) || results[n])) {
      return true;
    }
  }
  return false;
}

get _parser => ArgParser()
  ..addFlag("help", abbr: "h", negatable: false, help: "Show usage.")
  ..addOption(
    "plr-directory",
    abbr: "d",
    help: "Set directory to store plr related data.",
    valueHelp: "path",
  )
  ..addOption(
    "passphrase",
    abbr: "p",
    help: "Set passphrase to omit console input.",
    valueHelp: "passphrase",
  )
  ..addOption(
    "config",
    abbr: "c",
    help: "Set configuration file.",
    valueHelp: "file",
    defaultsTo: "config.json",
  )
  ..addOption(
    "issuerName",
    abbr: "i",
    help: "The issuer name to set to VC.",
    valueHelp: "string",
    defaultsTo: "The University of Tokyo",
  )
  ..addOption(
    "fidoNotary",
    abbr: "f",
    help: "The FIDO Notary to use.",
    valueHelp: "URI",
    defaultsTo: "https://dev-fido2yt.com",
  )
  ..addOption(
    "fidoNotaryKey",
    abbr: "k",
    help: "The FIDO Notary public key file.",
    valueHelp: "file",
    defaultsTo: "fidoNotary.key",
  )
  ..addOption(
    "userDatabase",
    abbr: "u",
    help: "Set user database file.",
    valueHelp: "file",
    defaultsTo: "user.db",
  )
  ..addCommand("storage", ArgParser()
    ..help = "Manage and connect to storages."
    ..runner = ((parser, results, appResults) =>
      StorageCommand(parser, results, appResults))
    ..addFlag(
      "types",
      abbr: "t",
      negatable: false,
      help: "List storage types.",
    )
    ..addFlag(
      "list",
      abbr: "l",
      negatable: false,
      help: "List registered storages.",
    )
    ..addOption(
      "new",
      abbr: "n",
      help: "Create a new storage connection.",
      valueHelp: "STORAGE-TYPE",
    )
    ..addOption(
      "remove",
      abbr: "r",
      help: "Remove a registered storage.",
      valueHelp: "STORAGE-ID",
    )
  )
  ..addCommand("daemon", ArgParser()
    ..help = "Run as the PLR Trusted Web daemon."
    ..runner = ((parser, results, appResults) =>
      DaemonCommand(parser, results, appResults))
    ..addOption(
      "storage",
      abbr: "s",
      help: "The storage to use.",
      valueHelp: "STORAGE-ID",
      mandatory: true,
    )
    ..addOption(
      "intervalTime",
      abbr: "t",
      help: "Minimal interval time (in seconds) to check the requests.",
      valueHelp: "seconds",
      defaultsTo: "60",
    )
    ..addFlag(
      "noWorker",
      abbr: "n",
      help: "Do not activate internal plr synchronization worker.",
    )
  )

  // !!! FOR TESTING !!!
  ..addCommand("tokenTest", ArgParser()
    ..help = "Test JWT Creation and Verification."
    ..runner = ((parser, results, appResults) =>
      TokenTestCommand(parser, results, appResults))
    ..addOption(
      "create",
      abbr: "c",
      help: "Create a JWT to the specified SUBJECT.",
      valueHelp: "SUBJECT-ID",
    )
    ..addOption(
      "expirationTime",
      abbr: "e",
      help: "Time (in seconds) to expire the JWT (create time).",
      valueHelp: "seconds",
      defaultsTo: defaultTokenExpirationTime.toString(),
    )
    ..addOption(
      "notBefore",
      abbr: "b",
      help: "Time (in seconds) to activate the JWT after creation (create time).",
      valueHelp: "seconds",
    )
    ..addOption(
      "jwtId",
      abbr: "j",
      help: "JWT ID to assign (create time).",
      valueHelp: "string",
    )
    ..addOption(
      "authenticationContext",
      abbr: "a",
      help: "The authentication context (create time).",
      valueHelp: "string",
      defaultsTo: defaultAuthenticationContext,
    )
    ..addOption(
      "verify",
      abbr: "v",
      help: "Verify the specified JWT.",
      valueHelp: "file (or `-' to read standart input).",
    )
  );
  // !!! FOR TESTING !!!

typedef Command RunnerCreator(
  ArgParser parser,
  ArgResults results,
  ArgResults appResults,
);

extension ArgParserExt on ArgParser {
  static final _help = Expando<String>();
  static final _runner = Expando<RunnerCreator>();

  String? get help => _help[this];
  void set help(String? value) { _help[this] = value; }

  RunnerCreator? get runner => _runner[this];
  void set runner(RunnerCreator? value) { _runner[this] = value; }
}
