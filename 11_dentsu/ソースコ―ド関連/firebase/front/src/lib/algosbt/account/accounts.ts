import 'dotenv/config';

import algosdk from 'algosdk';

export const test1Account = algosdk.mnemonicToSecretKey(
  process.env.TEST1_MNEMONIC || ''
);
export const test2Account = algosdk.mnemonicToSecretKey(
  process.env.TEST2_MNEMONIC || ''
);
export const test3Account = algosdk.mnemonicToSecretKey(
  process.env.TEST3_MNEMONIC || ''
);

const main = async () => {
  console.log(test1Account.addr);
  console.log(test2Account.addr);
  console.log(test3Account.addr);
};

if (require.main === module) {
  (async () => {
    await main();
    process.exit(0);
  })().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
