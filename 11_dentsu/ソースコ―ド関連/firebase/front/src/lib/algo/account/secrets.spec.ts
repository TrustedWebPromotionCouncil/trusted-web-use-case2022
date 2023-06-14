import { describe, it, expect } from 'vitest';

import * as secrets from './secrets';

describe('accounts', () => {
  it('should work', async () => {
    expect(secrets.test1Account.addr).toBeDefined();
    expect(secrets.test1Account.sk).toBeDefined();
    expect(secrets.test2Account.addr).toBeDefined();
    expect(secrets.test2Account.sk).toBeDefined();
    expect(secrets.test3Account.addr).toBeDefined();
    expect(secrets.test3Account.sk).toBeDefined();
  });
});
