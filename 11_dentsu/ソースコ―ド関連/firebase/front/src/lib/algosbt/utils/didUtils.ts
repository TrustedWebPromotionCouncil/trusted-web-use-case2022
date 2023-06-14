export const DID_FREFIX = 'did:pkh:algo:';

export const didFromAddress = (address: string) => {
  return `${DID_FREFIX}${address}`;
};

export const splitDid = (did: string) => {
  if (!did.startsWith(DID_FREFIX)) {
    throw new Error(`${did} must start with ${DID_FREFIX}`);
  }

  return [
    did.substring(0, DID_FREFIX.length),
    did.substring(DID_FREFIX.length),
  ];
};

export const addressFromDid = (did: string) => {
  if (!did.startsWith(DID_FREFIX)) {
    throw new Error(`${did} must start with ${DID_FREFIX}`);
  }

  return splitDid(did)[1];
};

export const shortenDid = (did: string) => {
  const pieces = splitDid(did);

  return `${pieces[0]}${pieces[1].slice(0, 3)}...${pieces[1].slice(-3)}`;
};
