import algosdk from 'algosdk';

const compile = async (algod: algosdk.Algodv2, source: string) => {
  const results = await algod.compile(source).do();

  return new Uint8Array(Buffer.from(results.result, 'base64'));
};

export default compile;
