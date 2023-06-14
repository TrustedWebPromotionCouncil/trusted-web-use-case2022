import algosdk from 'algosdk';

const getCreatedAsset = async (
  algod: algosdk.Algodv2,
  address: string,
  assetIndex: number
) => {
  const info = await algod.accountInformation(address).do();

  return info['created-assets'].find((as) => as.index === assetIndex);
};

export default getCreatedAsset;
