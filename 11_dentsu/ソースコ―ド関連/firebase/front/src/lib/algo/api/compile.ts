import algosdk from 'algosdk';

import * as u8a from 'uint8arrays';

const compile = async (algod: algosdk.Algodv2, source: string) => {
  const results = await algod.compile(source).do();

  return u8a.fromString(results.result, 'base64');
};

export default compile;
