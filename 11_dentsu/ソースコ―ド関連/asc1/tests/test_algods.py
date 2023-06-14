from algods import mainnet_algod, testnet_algod


def test_mainnet_algod() -> None:
    print(mainnet_algod.status())


def test_testnet_algod() -> None:
    print(testnet_algod.status())
