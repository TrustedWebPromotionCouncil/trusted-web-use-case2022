from accounts import (
    test1_address,
    test1_private_key,
    test2_address,
    test2_private_key,
    test3_address,
    test3_private_key,
)


def test_hoge() -> None:
    assert test1_address, "test1_address does not exist"
    assert test1_private_key, "test1_private_key does not exist"
    assert test2_address, "test2_address does not exist"
    assert test2_private_key, "test2_private_key does not exist"
    assert test3_address, "test3_address does not exist"
    assert test3_private_key, "test3_private_key does not exist"
