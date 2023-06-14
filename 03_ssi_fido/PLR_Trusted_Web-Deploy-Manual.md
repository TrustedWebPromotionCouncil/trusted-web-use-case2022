# Trusted Web with PLR.

Trusted Web implementation with PLR.

## Preparation.

### Place plrDart in the same directory.

```shell-session
% ls
plr_trusted_web

% git clone https://gitlab.com/ikeyan/plrDart.git
% cd plrDart
% cd ../plr_trusted_web
```

## Create the configureation file.

```shell-session
% dart bin/create_config.dart > config.json
```

Above command generates and registers RSA and BLS key pairs to the VDR and output its results to the stdout.

The result can be used directly as a configuration file for the plr_trusted_web command.

## Create FIDO Notary public key file.

The FIDO Notary public key is distributed in PEM format, but
plr_trusted_web can only handle keys in JWK format, so you need to
convert the key format.

You may need to install
[pem-jwk](https://www.npmjs.com/package/pem-jwk) or a similar tool to
convert.

```shell-session
% wget https://dev-fido2yt.com/pub/rsa512.pub.key
% pem-jwk rsa512.pub.key > fidoNotary.key
```

## General usage.

```shell-session
% dart bin/plr_trusted_web.dart -h
Usage: plr_trusted_web.dart [common options] command [command options]

common options:
-h, --help                       Show usage.
-d, --plr-directory=<path>       Set directory to store plr related data.
-p, --passphrase=<passphrase>    Set passphrase to omit console input.
-c, --config=<FILE>              Set configuration file.
                                 (defaults to "config.json")
-i, --issuerName=<string>        The issuer name to set to VC.
                                 (defaults to "The University of Tokyo")
-f, --fidoNotary=<URI>           The FIDO Notary to use.
                                 (defaults to "https://dev-fido2yt.com")
-k, --fidoNotaryKey=<FILE>       The FIDO Notary public key file.
                                 (defaults to "fidoNotary.key")
-u, --userDatabase=<FILE>        Set user database file.
                                 (defaults to "user.db")
commands:
storage - Manage and connect to storages.
daemon  - Run as the PLR Trusted Web daemon.
tokenTest - Test JWT Creation and Verification.
```

## Manage storages.

### Command usage.

```shell-session
% dart bin/plr_trusted_web.dart daemon -h

common options:
...snip

storage options:
-t, --types                  List storage types.
-l, --list                   List registered storages.
-n, --new=<STORAGE-TYPE>     Create a new storage connection.
-r, --remove=<STORAGE-ID>    Remove a registered storage.
```

### Create a new storage connnection for the Issuer user.

```shell-session
% dart bin/plr_trusted_web.dart storage -n googleDrive
Creating a new storage connection... Please go to the following URL and grant access:
  => https://accounts.google.com/...

...Authenticate the Issuer's google account with web browser.

done.
Storage created: 1: Google Drive - example@gmail.com (EXAMPLE)
Enter new passphrase: ****
Confirm new passphrase: ****
Exiting...
```

Please make sure you have the ID of the storage created, as it will be
used when starting the daemon. The ID in the above example is `1'.

## Run as an Issuer daemon.

### Command usage.

```shell-session
% dart bin/plr_trusted_web.dart daemon -h
Usage: plr_trusted_web.dart [common options] command [command options]

common options:
...snip

daemon options:
-s, --storage=<STORAGE-ID> (mandatory)    The storage to use.
-t, --intervalTime=<seconds>              Minimal interval time (in seconds) to check the requests.
                                          (defaults to "60")
-n, --[no-]noWorker                       Do not activate internal plr synchronization worker.

tokenTest options:
-c, --create=<SUBJECT-ID>                               Create a JWT to the specified SUBJECT.
-e, --expirationTime=<seconds>                          Time (in seconds) to expire the JWT (create time).
                                                        (defaults to "3600")
-b, --notBefore=<seconds>                               Time (in seconds) to activate the JWT after creation (create time).
-j, --jwtId=<string>                                    JWT ID to assign (create time).
-a, --authenticationContext=<string>                    The authentication context (create time).
                                                        (defaults to "PLR")
-v, --verify=<file (or `-' to read standart input).>    Verify the specified JWT.
```

### Run as a daemon.

```shell-session
% dart bin/plr_trusted_web.dart daemon -s STORAGE-ID
Connecting to the storage... done.
Storage connected: 1: Google Drive - example@gmail.com (EXAMPLE)
Enter passphrase: ****

... The logs of the daemon process will be output.
```

## Test to create / verfy ID Tokens.

### Command usage.

```shell-session
% dart bin/plr_trusted_web.dart tokenTest -h
Usage: plr_trusted_web.dart [common options] command [command options]

common options:
...snip

tokenTest options:
-c, --create=<SUBJECT-ID>                               Create a JWT to the specified SUBJECT.
-e, --expirationTime=<SECONDS>                          Time (in seconds) to expire the JWT (create time).
                                                        (defaults to "3600")
-b, --notBefore=<SECONDS>                               Time (in seconds) to activate the JWT after creation (create time).
-j, --jwtId=<STRING>                                    JWT ID to assign (create time).
-a, --authenticationContext=<STRING>                    The authentication context (create time).
                                                        (defaults to "plr")
-v, --verify=<FILE (or `-' to read standart input).>    Verify the specified JWT.
```

### Create a new token.

```shell-session
% dart bin/plr_trusted_web.dart tokenTest -c plr:googleDrive:example@gmail.com:20230112114530_P9x
Compact Serialization:
eyJhbGciOiJSUzI1NiIsImtpZCI6ImRpZDpleGFtcGxlOmlzc3VlcjM1NjIzIzEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJkaWQ6ZXhhbXBsZTppc3N1ZXIzNTYyMyIsInN1YiI6InBscjpnb29nbGVEcml2ZTpleGFtcGxlQGdtYWlsLmNvbToyMDIzMDExMjExNDUzMF9QOXgiLCJhdWQiOiJodHRwczovL2V4YW1wbGVfZmlkby5jb20iLCJleHAiOjE2NzQyMDczNjQsImF1dGhuQ3R4IjoicGxyIn0.GMz_vbG3a493qKhxZG5lg5_radv6YfpRRWOtet4kEPJvJjed0AmFtZycKIeVjPanOjCrxYGX-1oClB0gYqCuqm9yINmrAu3cKdmNIbPtvyvFRO6WR4kkxG0gX0UqO41as62ajLRimn2QMtRdG09zRN92ZcP3U1kqrg7Yz8j1JEAeG3MVjpbCk4L9IbltytsHL6GVK5Trei-ipQMh6lng5zj-P3pgjZhYiTkjjfFtZm7ppa8WVzTzGwk2-9RaVA_dCuzZ_VRF_l42BWzZja-wCI03acNBwO_BsDUdm0qwToJmC4oDJ4inJ24mnJ0RbuuGpZelto7nZguU2Q_KffEJvw
===
Common Header:
{
  "alg": "RS256",
  "kid": "did:example:issuer35623#1",
  "typ": "JWT"
}
---
Payload:
{
  "iss": "did:example:issuer35623",
  "sub": "plr:googleDrive:example@gmail.com:20230112114530_P9x",
  "aud": "https://dev-fido2yt.com",
  "iat": 1674203764,
  "exp": 1674207364,
  "authnCtx": "plr"
}
Exiting...
```

### Verify the Token.

```shell-session
% echo "THE.COMPACT.SERIALIZATION" | dart bin/plr_trusted_web.dart tokenTest -v -
Claims:
{
  "iss": "did:example:issuer35623",
  "sub": "plr:googleDrive:example@gmail.com:20230112114530_P9x",
  "aud": "https://example_fido.com",
  "iat": 1674203764,
  "exp": 1674207364,
  "authnCtx": "plr"
}
===
Verification result: succeed.
Exiting...
```

If verification fails, the cause is indicates as follows:

* different issuer.
* token expired.
* token not yet valid.
* invalid signature.
