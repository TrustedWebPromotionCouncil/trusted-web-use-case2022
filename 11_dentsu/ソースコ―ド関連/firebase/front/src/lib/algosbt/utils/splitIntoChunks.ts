const BATCH_SIZE = 16;

export const DEFAULT_CHUNK_LENGTH = 1023;

const splitIntoChunks = (
  message: Uint8Array,
  chunkLength: number = DEFAULT_CHUNK_LENGTH
) => {
  const chunks: Uint8Array[] = [];

  for (let i = 0; i < message.length; i += chunkLength) {
    chunks.push(message.slice(i, i + chunkLength));
  }

  const batches: Uint8Array[][] = [];

  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    batches.push(chunks.slice(i, i + BATCH_SIZE));
  }

  return batches;
};

export default splitIntoChunks;
