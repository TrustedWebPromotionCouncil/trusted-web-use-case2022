import os

from dotenv import load_dotenv
from algosdk import mnemonic, account

load_dotenv()

TEST1_MNEMONIC = os.getenv("TEST1_MNEMONIC")
TEST2_MNEMONIC = os.getenv("TEST2_MNEMONIC")
TEST3_MNEMONIC = os.getenv("TEST3_MNEMONIC")

test1_private_key = mnemonic.to_private_key(TEST1_MNEMONIC)
test1_address = account.address_from_private_key(test1_private_key)

test2_private_key = mnemonic.to_private_key(TEST2_MNEMONIC)
test2_address = account.address_from_private_key(test2_private_key)

test3_private_key = mnemonic.to_private_key(TEST3_MNEMONIC)
test3_address = account.address_from_private_key(test3_private_key)
