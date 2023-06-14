import algosdk from 'algosdk';

const sendWaitTxn = async (
  algod: algosdk.Algodv2,
  signedTxn: Uint8Array | Uint8Array[]
) => {
  const txResult = await algod.sendRawTransaction(signedTxn).do();
  const ctxResult = await algosdk.waitForConfirmation(algod, txResult.txId, 10);

  return ctxResult;
};

export default sendWaitTxn;
