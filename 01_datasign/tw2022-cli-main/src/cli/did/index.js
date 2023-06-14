import { Command } from 'commander';
import { cmd as generate } from './generate.js';
import { cmd as createKeyPair } from './create-key-pair.js';
import { cmd as resolve } from './resolve.js';
import { cmd as update } from './update.js';

export const cmd = new Command('did');
cmd.addCommand(generate);
cmd.addCommand(createKeyPair);
cmd.addCommand(resolve);
cmd.addCommand(update);
