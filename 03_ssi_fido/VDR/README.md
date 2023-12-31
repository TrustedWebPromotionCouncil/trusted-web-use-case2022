<!--
This README describes the package. If you publish this package to pub.dev,
this README's contents appear on the landing page for your package.

For information about how to write a good package README, see the guide for
[writing package pages](https://dart.dev/guides/libraries/writing-package-pages).

For general information about developing packages, see the Dart guide for
[creating packages](https://dart.dev/guides/libraries/create-library-packages)
and the Flutter guide for
[developing packages and plugins](https://flutter.dev/developing-packages).
-->

## About

A sample implementation of Verifiable Data Registry to issue DIDs and store public keys.

# How to start
This repository is implemented using Express with typescript
```
cd VDR
npm insall
npx ts-node index.ts
```
You can use other tools such as pm2.


## Create DID

```
URL
http://your_domain:8000/create_did

POST Method

INPUT: jwkSet
{
  "keys": [
    {
      "kty": "RSA",
      "n": "kY80Nkne6kMo7YUD-4klZfNffsf1jori8bfTaesN6f5gbXYo9mcUmibx_68Cm0NHeg0IMW95y2J8tcRk0tRqLdN246_SmQD4XfhDZMCD2cvJ2Du9ziBbqye8CC651_zGqHBJiCzf8qppQ7QcZwKtZ_d_useYfrLrb3KTHrrRVObzC0FX7fJHV010wFDNTQDiYFuvwY5CP4r7xOfUpGie7X3wnAZkhGa8DP61469MQboQA0ICcsGxJBI4JxmErO6D2VOXSFmrBMbXySVbWYVPTf7fZ_8MuevvBMp24A9Yu4vmQJyqq3PLM3Yq24Omtl4RcqjQMmSmFb0SdCXxesfPjQ==",
      "e": "AQAB"
    },
    {
      "kty": "OKP",
      "crv": "Bls12381G2",
      "x": "ra5S/xUwWnKBrxexHISuZlRRZPBjZ37wMvF3mfFiytW9urPY6JtiHzJ6t5jQCMHPE+aJ195CvaoS3uRGH0SoUjnGxeuMv+IcWpVhtmy2s1w7ZVgF7ZifpD0Bd9Eu8rpw"
    }
  ]
}

OUTPUT: 
{
  "id": "did:example:issuer15",
  "keys": [
    {
      "kty": "RSA",
      "n": "kY80Nkne6kMo7YUD-4klZfNffsf1jori8bfTaesN6f5gbXYo9mcUmibx_68Cm0NHeg0IMW95y2J8tcRk0tRqLdN246_SmQD4XfhDZMCD2cvJ2Du9ziBbqye8CC651_zGqHBJiCzf8qppQ7QcZwKtZ_d_useYfrLrb3KTHrrRVObzC0FX7fJHV010wFDNTQDiYFuvwY5CP4r7xOfUpGie7X3wnAZkhGa8DP61469MQboQA0ICcsGxJBI4JxmErO6D2VOXSFmrBMbXySVbWYVPTf7fZ_8MuevvBMp24A9Yu4vmQJyqq3PLM3Yq24Omtl4RcqjQMmSmFb0SdCXxesfPjQ==",
      "e": "AQAB",
      "kid": "did:example:issuer15#1"
    },
    {
      "kty": "OKP",
      "crv": "Bls12381G2",
      "x": "ra5S/xUwWnKBrxexHISuZlRRZPBjZ37wMvF3mfFiytW9urPY6JtiHzJ6t5jQCMHPE+aJ195CvaoS3uRGH0SoUjnGxeuMv+IcWpVhtmy2s1w7ZVgF7ZifpD0Bd9Eu8rpw",
      "kid": "did:example:issuer15#2"
    }
  ]
}
```

## Retrieve Key

```
URL
http://your_domain:8000/retrieve_key

POST Method

INPUT: kid
{
  "kid": "did:example:issuer15#1"
}

OUTPUT: publicKey
{
  "e": "AQAB",
  "n": "kY80Nkne6kMo7YUD-4klZfNffsf1jori8bfTaesN6f5gbXYo9mcUmibx_68Cm0NHeg0IMW95y2J8tcRk0tRqLdN246_SmQD4XfhDZMCD2cvJ2Du9ziBbqye8CC651_zGqHBJiCzf8qppQ7QcZwKtZ_d_useYfrLrb3KTHrrRVObzC0FX7fJHV010wFDNTQDiYFuvwY5CP4r7xOfUpGie7X3wnAZkhGa8DP61469MQboQA0ICcsGxJBI4JxmErO6D2VOXSFmrBMbXySVbWYVPTf7fZ_8MuevvBMp24A9Yu4vmQJyqq3PLM3Yq24Omtl4RcqjQMmSmFb0SdCXxesfPjQ==",
  "kid": "did:example:issuer15#1",
  "kty": "RSA"
}
```
