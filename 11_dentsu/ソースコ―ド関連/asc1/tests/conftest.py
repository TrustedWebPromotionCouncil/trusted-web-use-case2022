import pytest

from algosdk.v2client.algod import AlgodClient

from algods import testnet_algod


@pytest.fixture(scope="session")
def algod() -> AlgodClient:
    return testnet_algod
