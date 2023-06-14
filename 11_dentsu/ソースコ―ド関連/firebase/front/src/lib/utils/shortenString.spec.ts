import { describe, it, expect } from 'vitest';
import shortenString from './shortenString';

describe('shortenString', () => {
  it('should work', () => {
    expect(shortenString('abcdefghijklmnopqrstuvwxyz')).toEqual(
      'abcdef...uvwxyz'
    );
    expect(shortenString('abcdefg')).toEqual('abcdefg');
  });
});
