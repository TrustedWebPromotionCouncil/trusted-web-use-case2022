# BBS Signature
This repository is implemented using https://github.com/mattrglobal/bbs-signatures

## About

A sample implementation of Verifiable Credential Server to issue VCs and VPs with BBS+ signatures.

# How to start
This repository is implemented using Express with typescript
```
cd VCS
npm install
npx ts-node index.ts
```
You can use other tools such as pm2.

## Usage(BlsSign)
Proof: Signature to be attached to the VP

```
URL
http://your_domain:3000/bls_sign

POST Method

INPUT
publicKey: Issuer's publickey
secretkey: Issuer's secretkey
messages: string[] Divided into units for selective disclosure


OUTPUT: 
proof: ProofValue to be attached to the "VC"

```

## Usage(BlsVerify)
Proof: Signature to be attached to the VP

```
URL
http://your_domain:3000/bls_verify

POST Method

INPUT
signature: ProofValue to be attached to the "VC"
publickey: Issuer's publickey
messages: string[] Divided into units for selective disclosure


OUTPUT: 
is_verified: boolean

```


## Usage(CreateProof)
Proof: Signature to be attached to the VP

```
URL
http://your_domain:3000/bls_create_proof

POST Method

INPUT
signature: Signature to be attached to the "VC"
publickey: Issuer's publickey
messages: string[] Divided into units for selective disclosure
revealed: Index of "messages" to be disclosed.
nonce: nonce value


OUTPUT: 
proof: ProofValue

```

## Usage(VerifyProof)

```
URL
http://your_domain:3000/bls_verify_proof

POST Method

INPUT:
proof: Signature to be attached to the "VP"
publicKey: Issuer's publickey
messages: string[] Divided into units for selective disclosure
nonce: nonce value （Same value as the argument of createProof）.

OUTPUT
isProofVerified: boolean

```
