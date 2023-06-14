import { Command } from 'commander';
import { cmd as verify } from './verify.js';

export const cmd = new Command('vc');
cmd.addCommand(verify);
