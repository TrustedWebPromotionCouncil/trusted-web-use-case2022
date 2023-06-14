import 'dart:convert' show json, utf8;

import 'package:collection/collection.dart' show IterableExtension;
import 'package:dart_bbs/dart_bbs.dart' show createDid, vcCreate;
import 'package:dart_ssi/credentials.dart' show VerifiableCredential;
import 'package:drift/drift.dart';
import 'package:jose/jose.dart';
import 'package:plr_console/worker_daemon.dart';

import '../command.dart';
import '../db/api.dart';
import '../fido/api.dart';
import '../open_badge/api.dart';
import '../token/api.dart';

const _vdrResultDidKey = "id";

void _onError(Object error, StackTrace? stack) {
  print(error);
  if (stack != null) print(stack);
}

class DaemonCommand extends Command {
  DaemonCommand(super.parser, super.results, super.appResults);

  @override
  Future<void> call() async {
    var _config = await config;
    var _fidoNotaryKey = await fidoNotaryKey;

    var intervalTime = int.tryParse(results["intervalTime"]);
    if (intervalTime == null) {
      print(
        "Could not parse the intervalTime seconds: ${results["intervalTime"]}",
      );
      return;
    }

    var storage = await connect(results["storage"]!, passphrase);
    if (storage == null) return;

    //_initSearchTask(storage);

    var root = await storage.root;

    var requestReception = await _requestReceptionOf(await storage.publicRoot);
    if (requestReception == null) {
      print("Failed to get request reception.");
      return;
    }

    if (!results["noWorker"]!) {
      startWorkerDaemon()!.listen((l) {
          if (
            l.message.startsWith("Worker ") || l.message.startsWith("Sync ")
          ) return;
          print(l.toLogString());
      });
    }

    while (true) {
      var start = DateTime.now();
      try {
        await _doIt(_config, _fidoNotaryKey, storage, root, requestReception);
      } catch (e, s) {
        _onError(e, s);
      }
      var waitTime = intervalTime - start.difference(DateTime.now()).inSeconds;
      if (waitTime < 0) continue;

      await Future.delayed(Duration(seconds: waitTime));
    }
  }

  Future<RequestReception?> _requestReceptionOf(PublicRoot publicRoot) async {
    var requestReception = publicRoot.requestReception;
    if (requestReception == null) {
      await for (var _ in publicRoot.sync().handleError(_onError)) {
        if ((requestReception = publicRoot.requestReception) != null) {
          break;
        }
      }
    }
    if (requestReception == null) return null;

    await requestReception.sync().drain();
    return requestReception;
  }

  /*
  void _initSearchTask(Storage storage) {
    Future<void> run([_]) async {
      try {
        if (!storage.isSearchNodeFilesRunning) {
          await storage.searchNodeFiles().handleError(_onError).drain();
        }
      } catch (e, s) {
        _onError(e, s);
      }
    }
    run();

    Timer.periodic(Duration(seconds: entryInfoTimeout.inSeconds - 5), run);
  }
  */

  Future<void> _doIt(
    Config config,
    JsonWebKey fidoNotaryKey,
    Storage storage,
    Root root,
    RequestReception requestReception,
  ) async {
    await requestReception.sync().drain(); try {
      await _processFriendRegistrationRequest(config, root, requestReception);
      await Future.wait([
          _processFidoRegistrationTokenRequest(config, root, requestReception),
          _processDidIssuanceRequest(
            config, fidoNotaryKey, root, requestReception,
          ),
          _processVcIssuranceRequest(
            config, fidoNotaryKey, root, requestReception,
          ),
      ]);
    } finally {
      await requestReception.sync().drain();
    }
  }

  String _requestNameOf(TrustedWebRequest request) =>
    "${request.name?.defaultValue ?? request.id}(${request.plrId}";

  Future<void> _processFriendRegistrationRequest(
    Config config,
    Root root,
    RequestReception requestReception,
  ) async {
    var r;
    while ((r = requestReception.friendRequests.firstOrNull) != null) {
      print("${r.runtimeType} processing: ${r.plrId}");
      await root.newFriend(r);
      print("${r.runtimeType}: friend registered: ${r.plrId}");

      requestReception.removeFriendRequest(r);
      await requestReception.sync().drain();
    }
  }

  Future<List<dynamic>?> _prepareRequest(
    Root root,
    TrustedWebRequest request,
  ) async {
    await request.sync().drain();
    print("${request.runtimeType} processing: ${_requestNameOf(request)}");

    var friend = await _friendOf(root, request);
    if (friend == null) return null;

    var friendRequestReception =
      await _requestReceptionOf(friend.publicRoot!);
    if (friendRequestReception == null) return null;

    var user = await _userOf(friend, friendRequestReception, request);
    if (user == null) return null;

    var channel = await _channelOf(friend, friendRequestReception, request);
    if (channel == null) return null;

    await channel.sync().drain();

    return [ friend, friendRequestReception, user, channel ];
  }

  Future<Friend?> _friendOf(Root root, TrustedWebRequest request) async {
    var friend = await __friendOf(root, request.plrId);
    if (friend == null) print(
      "${request.runtimeType}: friend not found: ${_requestNameOf(request)}",
    );
    return friend;
  }

  Future<Friend?> __friendOf(Root root, PlrId? plrId) async {
    if (plrId == null) return null;

    Friend? friend;
    await for (var r in root.friendOf(plrId)) {
      friend = r.value;
    }
    if (friend == null) return null;

    await friend.sync().drain();

    var friendToMeRoot = friend.friendToMeRoot;
    if (friendToMeRoot == null) return null;

    var publicRoot = friend.publicRoot;
    if (publicRoot == null) return null;

    await Future.wait([
        friendToMeRoot.sync().drain(),
        publicRoot.sync().drain(),
    ]);
    return friend;
  }

  Future<void> _reportError(
    RequestReception friendRequestReception,
    TrustedWebRequest request,
    String errorMessage,
  ) async{
    if (request is FidoRegistrationTokenRequest) {
      friendRequestReception.addFidoRegistrationTokenResult(
        request, result: false, errorMessage: errorMessage,
      );
    } else if (request is DidIssuanceRequest) {
      friendRequestReception.addDidIssuanceResult(
        request, result: false, errorMessage: errorMessage,
      );
    } else if (request is VcIssuanceRequest) {
      friendRequestReception.addVcIssuanceResult(
        request, result: false, errorMessage: errorMessage,
      );
    }
    await friendRequestReception.sync().drain();
  }

  Future<Channel?> _channelOf(
    Friend friend,
    RequestReception friendRequestReception,
    TrustedWebRequest request,
  ) async {
    var channel = friend.friendToMeRoot!.channelOf(request.id);
    if (channel == null) {
      print(
        "${request.runtimeType}: channel not found: ${_requestNameOf(request)}",
      );
      await _reportError(
        friendRequestReception, request,
        "The channel could not be found in your disclosures.",
      );
    }
    return channel;
  }

  Future<User?> _userOf(
    Friend friend,
    RequestReception friendRequestReception,
    TrustedWebRequest request,
  ) async {
    var user = await userDatabase.userByEmail(friend.plrId.email);
    if (user == null) {
      /*
      print(
        "${request.runtimeType}: user not found: ${_requestNameOf(request)}",
      );
      await _reportError(
        friendRequestReception, request,
        "The channel could not be found in your disclosures.",
      );
      */

      // !!! TEMPORARY !!! CREATE NONEXISTENT USER !!!
      String? name; {
        Map<SchemaClass, Iterable<ProfileItem>>? profile;
        await for (
          var p in friend.profileWith(classes: [ ProfileClass.name ])
        ) {
          profile = p;
        }
        if (profile != null) {
          name = recentNameTextOf(profile);
        }
        name ??= friend.plrId.email;
      }
      user = await userDatabase.createUser(
        name: name, email: friend.plrId.email,
      );
    }
    return user;
  }

  Future<void> _processFidoRegistrationTokenRequest(
    Config config,
    Root root,
    RequestReception requestReception,
  ) async {
    var issuer = config.id;
    var key = config.rsaKey;

    Future<void> removeFidoRegistrationTokenRequest(
      FidoRegistrationTokenRequest request,
    ) async {
      requestReception.removeFidoRegistrationTokenRequest(request);
      await requestReception.sync().drain();
    }

    var r;
    while (
      (r = requestReception.fidoRegistrationTokenRequests.firstOrNull) != null
    ) {
      RequestReception friendRequestReception;
      Channel channel; {
        var rr = await _prepareRequest(root, r);
        if (rr == null) {
          await removeFidoRegistrationTokenRequest(r);
          continue;
        }
        friendRequestReception = rr[1];
        channel = rr[3];
      }

      var token = createToken(
        issuer: issuer,
        subject: createFidoId(channel),
        audience: fidoNotary,
        expirationTime: defaultTokenExpirationTime,
        authenticationContext: defaultAuthenticationContext,
        key: key,
      );
      channel.fidoRegistrationToken = token;
      await channel.sync().drain();

      friendRequestReception.addFidoRegistrationTokenResult(
        channel, result: true,
      );
      await Future.wait([
          friendRequestReception.sync().drain(),
          removeFidoRegistrationTokenRequest(r),
      ]);
      print(
        "${r.runtimeType}: The token has been issued: ${_requestNameOf(r)}",
      );
    }
  }

  Future<JsonWebSignature?> _verifyAuthenticationToken(
    JsonWebKey fidoNotaryKey,
    RequestReception friendRequestReception,
    Channel channel,
    TrustedWebRequest request,
  ) async {
    var token = channel.fidoAuthenticationToken;
    if (token == null) {
      await _reportError(
        friendRequestReception, request,
        "The FIDO Authentication Token is expired or not found.",
      );
      return null;
    } else if (!await token.verify(JsonWebKeyStore()..addKey(fidoNotaryKey))) {
      await _reportError(
        friendRequestReception, request,
        "The FIDO Authentication Token signature validiation was failed.",
      );
      return null;
    }
    return token;
  }

  Future<String?> _fidoIdOf(
    RequestReception friendRequestReception,
    JsonWebSignature token,
    TrustedWebRequest request,
  ) async {
    var fidoId = JsonWebTokenClaims.fromJson(
      token.unverifiedPayload.jsonContent,
    ).subject;

    if (fidoId == null) {
      await _reportError(
        friendRequestReception, request,
        "The FIDO Authentication Token has no subject field.",
      );
      return null;
    }
    return fidoId;
  }

  Future<void> _processDidIssuanceRequest(
    Config config,
    JsonWebKey fidoNotaryKey,
    Root root,
    RequestReception requestReception,
  ) async {
    Future<void> removeDidIssuanceRequest(
      DidIssuanceRequest request,
    ) async {
      requestReception.removeDidIssuanceRequest(request);
      await requestReception.sync().drain();
    }

    var r;
    while (
      (r = requestReception.didIssuanceRequests.firstOrNull) != null
    ) {
      RequestReception friendRequestReception;
      User user;
      Channel channel; {
        var rr = await _prepareRequest(root, r);
        if (rr == null) {
          await removeDidIssuanceRequest(r);
          continue;
        }
        friendRequestReception = rr[1];
        user = rr[2];
        channel = rr[3];
      }

      var token = await _verifyAuthenticationToken(
        fidoNotaryKey, friendRequestReception, channel, r,
      );
      if (token == null) {
        await removeDidIssuanceRequest(r);
        continue;
      }

      var fidoId = await _fidoIdOf(friendRequestReception, token, r);
      if (fidoId == null) {
        await removeDidIssuanceRequest(r);
        continue;
      }

      var keySet = await _issueDid(friendRequestReception, channel, r);
      if (keySet == null) {
        await removeDidIssuanceRequest(r);
        continue;
      }
      var did = keySet[_vdrResultDidKey]!;

      await userDatabase.updateUser(
        user.copyWith(fidoId: Value(fidoId), did: Value(did)),
      );

      channel
        ..fidoId = fidoId
        ..did = did
        // Override public key with issued kid.
        ..didPublicKey = keySet.keys.first;
      await channel.sync().drain();

      friendRequestReception.addDidIssuanceResult(channel, result: true);
      await Future.wait([
          friendRequestReception.sync().drain(),
          removeDidIssuanceRequest(r),
      ]);
      print(
        "${r.runtimeType}: The DID has been issued: ${_requestNameOf(r)}",
      );
    }
  }

  Future<JsonWebKeySet?> _issueDid(
    RequestReception friendRequestReception,
    Channel channel,
    DidIssuanceRequest request,
  ) async {
    var publicKey = channel.didPublicKey;
    if (publicKey == null) {
      await _reportError(
        friendRequestReception, request,
        "The public key for issuing DID could not be found.",
      );
      return null;
    }

    var keySet = JsonWebKeySet.fromJson(
      await createDid(
        json.encode(JsonWebKeySet.fromKeys([ publicKey ]).toJson()),
      ),
    );
    if (keySet[_vdrResultDidKey] == null) {
      await _reportError(
        friendRequestReception, request, "DID was failed to be issued.",
      );
      return null;
    }
    return keySet;
  }

  Future<void> _processVcIssuranceRequest(
    Config config,
    JsonWebKey fidoNotaryKey,
    Root root,
    RequestReception requestReception,
  ) async {
    Future<void> removeVcIssuanceRequest(
      VcIssuanceRequest request,
    ) async {
      requestReception.removeVcIssuanceRequest(request);
      await requestReception.sync().drain();
    }

    var r;
    while (
      (r = requestReception.vcIssuanceRequests.firstOrNull) != null
    ) {
      RequestReception friendRequestReception;
      User user;
      Channel channel; {
        var rr = await _prepareRequest(root, r);
        if (rr == null) {
          await removeVcIssuanceRequest(r);
          continue;
        }
        friendRequestReception = rr[1];
        user = rr[2];
        channel = rr[3];
      }

      var token = await _verifyAuthenticationToken(
        fidoNotaryKey, friendRequestReception, channel, r,
      );
      if (token == null) {
        await removeVcIssuanceRequest(r);
        continue;
      }

      var fidoId = await _fidoIdOf(friendRequestReception, token, r);
      if (fidoId == null) {
        await removeVcIssuanceRequest(r);
        continue;
      }
      if (fidoId != user.fidoId) {
        await Future.wait([
            _reportError(
              friendRequestReception, r,
              "The subject of the FIDO Authentication Token did not match"
              " the registerd FIDO-ID.",
            ),
            removeVcIssuanceRequest(r),
        ]);
        continue;
      }

      if (user.did == null) {
        await Future.wait([
            _reportError(
              friendRequestReception, r, "The DID has not been registered.",
            ),
            removeVcIssuanceRequest(r),
        ]);
        continue;
      }

      var items = <Item>[];
      for (var c in _createCredentials(config, user, r)) {
        var vc = await vcCreate(
          json.encode(c), config.blsPrivateKey.key, config.blsKeyId,
        );

        var item = channel.newTimelineItemModel(
          vcClass, begin: DateTime.parse(c[issuanceDateKey]),
        )..creatorPlrId = root.plrId;

        var file = (
          await item.newFileModel(cntProperty)
        )
        ..format = vcContentType
        ..title.value = c[nameKey];

        await file.putData(utf8.encode(vc));

        items.add(item);
      }
      await channel.syncNewTimelineItems().drain();

      friendRequestReception.addVcIssuanceResult(
        channel, result: true,
        resultItemTags: await Future.wait(items.map((i) => i.timelineItemTag)),
      );
      await Future.wait([
          friendRequestReception.sync().drain(),
          removeVcIssuanceRequest(r),
      ]);
      print(
        "${r.runtimeType}: Certificates have been issued: ${_requestNameOf(r)}",
      );
    }
  }

  Map<String, dynamic> _templateOf(String id) => {
    idKey: id,
  };

  Map<String, dynamic> _profileTemplateOf(String id) =>
    _templateOf(id)..[typeKey] = profileType;

  Map<String, dynamic> _achivementSubjectTemplateOf(String id) =>
    _templateOf(id)..[typeKey] = achievementSubjectType;

  List<Map<String, dynamic>> _holderCredentialSubjectsOf(User user) => [
    _profileTemplateOf(user.did!)..[nameKey] = user.name,
    _profileTemplateOf(user.did!)..[dateOfBirthKey] =
      user.dateOfBirth.toIso8601String().split("T")[0],
    _profileTemplateOf(user.did!)..[sexKey] = user.sex.name,
  ];

  List<Map<String, dynamic>> _createCredentials(
    Config config,
    User user,
    VcIssuanceRequest request,
  ) {
    var holderCredentialSubjects = _holderCredentialSubjectsOf(user);

    return request.certificateTypes.map((t) {
        List<Map<String, dynamic>> credentialSubjects;
        switch (t) {
          case CertificateType.Transcript: {
            credentialSubjects = _transcriptCredentialSubjectsOf(user);
            break;
          }
        }
        return _createCredential(
          config, t.name,
          credentialSubjects..insertAll(0, holderCredentialSubjects),
        );
    }).toList();
  }

  Map<String, dynamic> _createCredential(
    Config config,
    String name,
    List<Map<String, dynamic>> credentialSubjects,
  ) => VerifiableCredential(
    context: vcContexts,
    type: vcTypes,
    issuer: _profileTemplateOf(config.id)..[nameKey] = issuerName,
    issuanceDate: DateTime.now().toUtc(),
    credentialSubject: credentialSubjects,
  ).toJson()..[nameKey] = name;

  List<Map<String, dynamic>> _transcriptCredentialSubjectsOf(
    User user,
  ) => user.achievements.map(
    (a) => _achivementSubjectTemplateOf(user.did!)
      ..[creditsEarnedKey] = a.creditsEarned
      ..[resultKey] = {
        achievedLevelKey: a.achievedLevel.name,
      }
      ..[achievementKey] = {
        typeKey: courceType,
        nameKey: a.name,
        descriptionKey: a.description,
      },
  ).toList();
}
