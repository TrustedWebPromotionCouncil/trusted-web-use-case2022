import { Command } from 'commander';
import { cmd as query } from './query.js';

export const cmd = new Command('dwn');
cmd.addCommand(query);
