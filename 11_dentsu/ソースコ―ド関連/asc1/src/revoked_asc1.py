from pyteal import (
    Approve,
    Mode,
    compileTeal,
    Cond,
    Txn,
    OnComplete,
    Int,
    App,
    Bytes,
    Seq,
    Subroutine,
    Expr,
    TealType,
    Btoi,
    Assert,
    Global,
    Gtxn,
)
from algosdk.future.transaction import StateSchema


class GlobalVariables:
    revoked = Bytes("revoked")


class AppMethods:
    set_revoked = Bytes("set_revoked")


global_schema = StateSchema(1, 0)
local_schema = StateSchema(0, 0)


def approval_program() -> str:
    program = Seq(
        Cond(
            [Txn.application_id() == Int(0), create()],
            [Txn.on_completion() == OnComplete.NoOp, no_op()],
            [Txn.on_completion() == OnComplete.ClearState, Approve()],
            [Txn.on_completion() == OnComplete.CloseOut, Approve()],
            [Txn.on_completion() == OnComplete.DeleteApplication, Approve()],
            [Txn.on_completion() == OnComplete.OptIn, Approve()],
            [Txn.on_completion() == OnComplete.UpdateApplication, Approve()],
        ),
        Approve(),
    )
    return compileTeal(program, Mode.Application, version=6)


def clear_state_program() -> str:
    return compileTeal(Approve(), Mode.Application, version=6)


@Subroutine(TealType.none)
def create() -> Expr:
    return Seq(App.globalPut(GlobalVariables.revoked, Int(0)))


@Subroutine(TealType.none)
def no_op() -> Expr:
    return Seq(
        Cond(
            [Txn.application_args[0] == AppMethods.set_revoked, set_revoked()],
        )
    )


@Subroutine(TealType.none)
def set_revoked() -> Expr:
    revoked = Btoi(Txn.application_args[1])

    return Seq(
        check_set_revoked(),
        App.globalPut(GlobalVariables.revoked, revoked),
    )


@Subroutine(TealType.none)
def check_set_revoked() -> Expr:
    return Seq(
        check_zero_addresses(Int(0)),
        Assert(Global.group_size() == Int(1)),
        Assert(Txn.sender() == Global.creator_address()),
        Assert(Txn.application_args.length() == Int(2)),
    )


@Subroutine(TealType.none)
def check_zero_addresses(gtxn_index: Expr) -> Expr:
    return Seq(
        Assert(Gtxn[gtxn_index].rekey_to() == Global.zero_address()),
        Assert(Gtxn[gtxn_index].close_remainder_to() == Global.zero_address()),
        Assert(Gtxn[gtxn_index].asset_close_to() == Global.zero_address()),
    )


def main() -> None:
    print(approval_program())


if __name__ == "__main__":
    main()
