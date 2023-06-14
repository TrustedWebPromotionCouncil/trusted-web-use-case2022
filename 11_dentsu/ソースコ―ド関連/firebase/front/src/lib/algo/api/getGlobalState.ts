import * as algosdk from 'algosdk';
import * as u8a from 'uint8arrays';

export const formatState = (
  state: Record<string, any>[]
): Record<string, any> => {
  const ret: Record<string, any> = {};

  state.forEach((item) => {
    const key = item.key;
    const value = item.value;

    const formattedKey = u8a.toString(u8a.fromString(key, 'base64'), 'utf-8');

    if (value.type === 1) {
      ret[formattedKey] = u8a.fromString(value.bytes, 'base64');
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
