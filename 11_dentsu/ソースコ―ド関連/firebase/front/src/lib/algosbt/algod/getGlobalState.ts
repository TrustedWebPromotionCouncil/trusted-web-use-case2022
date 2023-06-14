import algosdk from 'algosdk';

export const formatBytesValue = (val: string) => {
  const buf = Buffer.from(val, 'base64');
  const binary = Uint8Array.from(buf);

  try {
    const address = algosdk.encodeAddress(binary);

    if (algosdk.isValidAddress(address)) {
      return address;
    }

    try {
      return buf.toString('utf-8');
    } catch (e) {
      console.log(e);
      return binary;
    }
  } catch (e) {
    try {
      return buf.toString('utf-8');
    } catch (e) {
      return binary;
    }
  }
};

export const formatState = (
  state: Record<string, any>[]
): Record<string, any> => {
  const ret: Record<string, any> = {};

  state.forEach((item) => {
    const key = item.key;
    const value = item.value;

    const formattedKey = Buffer.from(key, 'base64').toString('utf-8');

    if (value.type === 1) {
      ret[formattedKey] = formatBytesValue(value.bytes);
    } else {
      ret[formattedKey] = value.uint;
    }
  });

  return ret;
};

const getGlobalState = async (algod: algosdk.Algodv2, appIndex: number) => {
  const info = await algod.getApplicationByID(appIndex).do();

  if (info['params']['global-state']) {
    const state: Record<string, any>[] = info['params']['global-state'];

    return formatState(state);
  }

  return formatState([]);
};

export default getGlobalState;
