import { describe, it, expect } from 'vitest';

import { testNetAlgod as algod } from '../algod/algods';
import approvalTeal from '../teal/revokedApproval.teal';
import compile from './compile';

describe('compile', () => {
  it('should work', async () => {
    const program = await compile(algod, approvalTeal);

    expect(program).toBeDefined();
  });
});
