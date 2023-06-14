import { Command } from 'commander';

import { cmd as did } from './did/index.js';
import { cmd as dwn } from './dwn/index.js';
import { cmd as vc } from './vc/index.js';

export const cli = new Command('execute');
cli.description('TrustedWeb2022 Cli tools');
cli.version('0.0.1');

cli.addCommand(did);
cli.addCommand(dwn);
cli.addCommand(vc);
