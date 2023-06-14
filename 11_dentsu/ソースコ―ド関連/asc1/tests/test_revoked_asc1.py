from typing import Iterator

from algosdk.v2client.algod import AlgodClient
from algosdk.error import AlgodHTTPError

import pytest

from algosdk_helper import (
    read_global_state,
    create_app,
    delete_app,
    compile_smart_contract,
    call_app,
)
from accounts import test1_private_key, test2_private_key

from revoked_asc1 import (
    approval_program,
    clear_state_program,
    global_schema,
    local_schema,
)


@pytest.fixture
def app_index(algod: AlgodClient) -> Iterator[int]:
    approval = compile_smart_contract(algod, approval_program())
    clear = compile_smart_contract(algod, clear_state_program())

    app_index = create_app(
        algod,
        test1_private_key,
        approval,
        clear,
        global_schema,
        local_schema,
    )
    yield app_index

    delete_app(algod, test1_private_key, app_index)


def test_revoked_asc1(algod: AlgodClient, app_index: int) -> None:
    state = read_global_state(algod, app_index)
    assert state["revoked"] == 0

    app_args = ["set_revoked", 1]
    call_app(algod, test1_private_key, app_index, app_args)
    state = read_global_state(algod, app_index)
    assert state["revoked"] == 1


def test_check_set_revoked_sender(
    algod: AlgodClient,
    app_index: int,
) -> None:
    assert algod
    assert app_index

    with pytest.raises(AlgodHTTPError) as e:
        app_args = ["set_revoked", 1]
        call_app(algod, test2_private_key, app_index, app_args)
    print(e)
