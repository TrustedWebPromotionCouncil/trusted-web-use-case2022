# TW2022 Cli Tools

cli tools run by commander.js

[![Version](https://camo.githubusercontent.com/7c1fb38ed5c97df9a869f9f107fc7da4391c9b3dc258d4eb8add38f01f6451ad/687474703a2f2f696d672e736869656c64732e696f2f6e706d2f762f636f6d6d616e6465722e7376673f7374796c653d666c6174)](https://www.npmjs.org/package/commander)

<!-- toc -->

- [Setup](#setup)
- [Usage](#usage)
- [Commands](#commands)
<!-- tocstop -->

# Setup

<!-- setup -->

```sh-session
$ git clone git@github.com:datasign-inc/tw2022-cli.git
$ cd tw2022-cli
$ yarn install
```

<!-- setupstop -->

# Usage

<!-- usage -->

```sh-session
$ ./bin/execute [options] [command]
```

<!-- usagestop -->

# Commands

<!-- commands -->

- [`did generate`](#did generate)
- [`did createKeyPair`](#did createKeyPair)
- [`dwn query`](#dwn query)
- [`vc verify`](#vc verify)

## `did generate`
Generate DID to ION
```
$ ./bin/execute did generate
Usage: execute did generate [options]

Generate DID
 put files to tw2022-cli/files/

Options:
  --publicKeyJson <publicKeyJson>  publicKey Json file put to tw2022-cli/files/
  --servicesJson <servicesJson>    services Json file put to tw2022-cli/files/
  -h, --help                       display help for command
```

## `did createKeyPair`
Create KeyPair
```
$ ./bin/execute did createKeyPair
Usage: execute did createKeyPair [options]

createKeyPair by ion-tools

Options:
  -t, --type <type>  type (default: "secp256k1")
  -h, --help         display help for command
```

## `dwn query`
Get Personal Data from DWN
```
$  ./bin/execute dwn query
Usage: execute dwn query [options]

get personal data from DWebNode

Options:
  --targetDid <targetDid>                  Target Did
  --recipientDid <recipientDid>            R$ecipient Did
  --privateKeyJwkPath <privateKeyJwkPath>  Path to privateKeyJwk JSON (default: "./privateKey.json")
  --filterPath <filterPath>                Path to Filter JSON (default: "./filter.json")
  --keyId <keyId>                          ID for Key Pair (default: "key-1")
  --outPath <outPath>                      Output Path (default: "./out")
  -h, --help                               display help for command
```

## `vc verify`
Verify Downloaded Personal Data VC
```
$ ./bin/execute vc verify
Usage: execute vc verify [options]

Verify Downloaded VC

Options:
  --vcPath <vcPath>  Path to Downloaded VC Files (default: "./out")
  -h, --help         display help for command
```
<!-- commandsstop -->
