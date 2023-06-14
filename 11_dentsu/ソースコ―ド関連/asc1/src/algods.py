from algosdk.v2client.algod import AlgodClient


mainnet_algod = AlgodClient("", "https://node.algoexplorerapi.io:443")
testnet_algod = AlgodClient("", "https://node.testnet.algoexplorerapi.io:443")
