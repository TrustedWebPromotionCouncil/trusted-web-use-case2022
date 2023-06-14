const teal = `#pragma version 6
txn ApplicationID
int 0
==
bnz main_l14
txn OnCompletion
int NoOp
==
bnz main_l13
txn OnCompletion
int ClearState
==
bnz main_l12
txn OnCompletion
int CloseOut
==
bnz main_l11
txn OnCompletion
int DeleteApplication
==
bnz main_l10
txn OnCompletion
int OptIn
==
bnz main_l9
txn OnCompletion
int UpdateApplication
==
bnz main_l8
err
main_l8:
int 1
return
main_l9:
int 1
return
main_l10:
int 1
return
main_l11:
int 1
return
main_l12:
int 1
return
main_l13:
callsub noop_1
b main_l15
main_l14:
callsub create_0
main_l15:
int 1
return

// create
create_0:
byte "revoked"
int 0
app_global_put
retsub

// no_op
noop_1:
txna ApplicationArgs 0
byte "set_revoked"
==
bnz noop_1_l2
err
noop_1_l2:
callsub setrevoked_2
retsub

// set_revoked
setrevoked_2:
callsub checksetrevoked_3
byte "revoked"
txna ApplicationArgs 1
btoi
app_global_put
retsub

// check_set_revoked
checksetrevoked_3:
int 0
callsub checkzeroaddresses_4
global GroupSize
int 1
==
assert
txn Sender
global CreatorAddress
==
assert
txn NumAppArgs
int 2
==
assert
retsub

// check_zero_addresses
checkzeroaddresses_4:
store 0
load 0
gtxns RekeyTo
global ZeroAddress
==
assert
load 0
gtxns CloseRemainderTo
global ZeroAddress
==
assert
load 0
gtxns AssetCloseTo
global ZeroAddress
==
assert
retsub`;

export default teal;