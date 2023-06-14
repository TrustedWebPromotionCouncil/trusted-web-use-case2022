from base64 import b64decode
from typing import Any, Optional, cast

from algosdk.future.transaction import (
    Transaction,
    SignedTransaction,
    wait_for_confirmation,
    OnComplete,
    ApplicationCreateTxn,
    ApplicationNoOpTxn,
    ApplicationDeleteTxn,
    StateSchema,
)
from algosdk.account import address_from_private_key
from algosdk.v2client.algod import AlgodClient
from algosdk.encoding import encode_address


def compile_smart_contract(algod: AlgodClient, source_code: str) -> bytes:
    compile_response = algod.compile(source_code)
    return b64decode(cast(str, compile_response["result"]))


def send_wait_transaction(
    algod: AlgodClient, signed_txns: list[SignedTransaction]
) -> Any:
    tx_id = cast(str, algod.send_transactions(signed_txns))

    try:
        transaction_response = wait_for_confirmation(algod, tx_id, 10)
        print("TXID: ", tx_id)
        print(
            "Result confirmed in round: {}".format(
                cast(int, transaction_response["confirmed-round"])
            )
        )
        return transaction_response

    except Exception as err:
        print(err)
        return


def sign_send_wait_transaction(
    algod: AlgodClient, txn: Transaction, private_key: str
) -> Any:
    signed_txn = txn.sign(private_key)
    return send_wait_transaction(algod, [signed_txn])


def create_app(
    algod: AlgodClient,
    private_key: str,
    approval_program: bytes,
    clear_program: bytes,
    global_schema: StateSchema,
    local_schema: StateSchema,
    foreign_assets: Optional[list[int]] = None,
    app_args: Optional[list[bytes]] = None,
) -> int:
    print("create_app()")
    sender = address_from_private_key(private_key)
    on_complete = OnComplete.NoOpOC.real
    sp = algod.suggested_params()

    txn = ApplicationCreateTxn(
        sender,
        sp,
        on_complete,
        approval_program,
        clear_program,
        global_schema,
        local_schema,
        foreign_assets=foreign_assets,
        app_args=app_args,
    )

    txn_res = sign_send_wait_transaction(algod, txn, private_key)
    app_index = int(txn_res["application-index"])

    print("Sender:", sender)
    print("Application Index:", app_index)

    return app_index


def call_app(
    algod: AlgodClient,
    private_key: str,
    app_index: int,
    app_args: list[bytes],
    foreign_assets: Optional[list[int]] = None,
    accounts: Optional[list[int]] = None,
) -> None:
    print("call_app()")
    sender = address_from_private_key(private_key)
    sp = algod.suggested_params()

    print("Sender:", sender)
    print("Application Index:", app_index)
    print("Application Args:", app_args)

    txn = ApplicationNoOpTxn(
        sender,
        sp,
        app_index,
        app_args,
        foreign_assets=foreign_assets,
        accounts=accounts,
    )

    sign_send_wait_transaction(algod, txn, private_key)


def delete_app(algod: AlgodClient, private_key: str, app_index: int) -> None:
    print("delete_app()")
    sender = address_from_private_key(private_key)
    sp = algod.suggested_params()

    print("Sender:", sender)
    print("Application Index:", app_index)

    txn = ApplicationDeleteTxn(sender, sp, index=app_index)
    sign_send_wait_transaction(algod, txn, private_key)


def format_b64bytes(val: bytes) -> str | bytes:
    formatted_value = b64decode(val)

    try:
        return formatted_value.decode("utf-8")
    except UnicodeDecodeError:
        try:
            return cast(str, encode_address(formatted_value))
        except Exception:
            pass

    return formatted_value


def format_state(state: list[dict[str, Any]]) -> dict[str, Any]:
    formatted = {}
    for item in state:
        key = item["key"]
        value = item["value"]
        formatted_key = b64decode(key).decode("utf-8")
        if int(value["type"]) == 1:
            # byte string
            formatted_value = format_b64bytes(value["bytes"])
            formatted[formatted_key] = formatted_value
        else:
            # integer
            formatted[formatted_key] = value["uint"]
    return formatted


def read_global_state(client: AlgodClient, app_id: int) -> dict[str, Any]:
    app_info = client.application_info(app_id)
    global_state = cast(
        list[dict[str, Any]],
        (
            app_info["params"]["global-state"]
            if "global-state" in app_info["params"]
            else []
        ),
    )
    return format_state(global_state)
