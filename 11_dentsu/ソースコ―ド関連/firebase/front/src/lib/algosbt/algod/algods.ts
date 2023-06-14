import algosdk from 'algosdk';

const MAINNET_ALGOD = 'https://node.algoexplorerapi.io';
const TESTNET_ALGOD = 'https://node.testnet.algoexplorerapi.io';

export const mainNetAlgod = new algosdk.Algodv2('', MAINNET_ALGOD, 443);
export const testNetAlgod = new algosdk.Algodv2('', TESTNET_ALGOD, 443);
