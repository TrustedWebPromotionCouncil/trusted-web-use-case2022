import { describe, it, expect } from 'vitest';
import formatBigint from './formatBigint';

describe('formatBigint', () => {
  it('should work', () => {
    expect(formatBigint(BigInt(10000000))).to.equal('10.000000');
  });
});
