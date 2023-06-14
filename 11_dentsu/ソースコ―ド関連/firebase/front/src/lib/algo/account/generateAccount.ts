import algosdk from 'algosdk';

const account = algosdk.generateAccount();
const mn = algosdk.secretKeyToMnemonic(account.sk);

console.log('Address:', account.addr);
console.log('Mnemonic:', mn);
