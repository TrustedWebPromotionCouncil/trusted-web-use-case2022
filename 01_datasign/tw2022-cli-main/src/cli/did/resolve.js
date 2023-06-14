import { resolve } from '../../../node_modules/@decentralized-identity/ion-tools/dist/esm/src/index.js';
import { Command } from 'commander';
import fs from 'node:fs/promises';

export const cmd = new Command('resolve');
cmd.description('Resolve generated DID in ION');
cmd.requiredOption('--didDir <didDir>', 'domain of did service endpoint', './out');

cmd.action(async () => {
  const { didDir } = cmd.opts();
  const didJson = JSON.parse(await fs.readFile(`${didDir}/did.json`));
  console.log('--------------didJson.did--------------\n', didJson.did);
  console.log('--------------didJson.did.longForm--------------\n', didJson.did.longForm);
  const response = await resolve(didJson.did.longForm);
  console.log('--------------response--------------\n', response);
  console.log('--------------response.didDocument--------------\n', response.didDocument);
  console.log('--------------verificationMethod--------------\n', response.didDocument.verificationMethod);
  console.log('--------------response.didDocument.service--------------\n', response.didDocument.service);
  console.log('--------------serviceEndpoint--------------\n', response.didDocument.service[0].serviceEndpoint);
});
