import algosdk from 'algosdk';

import splitIntoChunks, {
  DEFAULT_CHUNK_LENGTH,
} from '../utils/splitIntoChunks';
import saveBatchNotes from './saveBatchNotes';

type TxnParams = {
  from: string;
  assetIndex: number;
  message: Uint8Array;
};

const saveMessage = async (
  algod: algosdk.Algodv2,
  { from, assetIndex, message }: TxnParams,
  secretKey: Uint8Array,
  chunkLength = DEFAULT_CHUNK_LENGTH
) => {
  const batches = splitIntoChunks(message, chunkLength);

  for (let i = 0; i < batches.length; i += 1) {
    const notes = batches[i];

    await saveBatchNotes(algod, { from, assetIndex, notes }, secretKey);
  }
};

export default saveMessage;
