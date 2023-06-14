import * as didJWT from 'did-jwt';
import * as algosdk from 'algosdk';

export const tryDidjwt = async () => {
  const issAccount = algosdk.generateAccount();
  const audAccount = algosdk.generateAccount();

  const signer = didJWT.EdDSASigner(issAccount.sk);
  const jwt = await didJWT.createJWT(
    { aud: `did:algo:${audAccount.addr}`, name: 'aaa' },
    { issuer: `did:algo:${issAccount.addr}`, signer },
    { alg: 'EdDSA' }
  );

  console.log(jwt);

  const decoded = didJWT.decodeJWT(jwt);

  console.log(decoded);
};
