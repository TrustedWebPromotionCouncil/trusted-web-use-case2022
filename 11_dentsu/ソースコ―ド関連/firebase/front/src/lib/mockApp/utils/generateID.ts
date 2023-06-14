// import { randomUUID } from 'crypto';

export const generateID = (
  kinds: 'resident' | 'account' | 'tax' | 'subsidy'
): string => {
  const id = `${kinds.substring(0, 3)}:${crypto.randomUUID()}`;
  return id;
};
