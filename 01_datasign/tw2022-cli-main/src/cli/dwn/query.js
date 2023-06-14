import fs from 'node:fs/promises';
import { Command } from 'commander';
import fetch from 'cross-fetch';
import { resolve } from '../../../node_modules/@decentralized-identity/ion-tools/dist/esm/src/index.js';
import { CollectionsQuery } from '@tbd54566975/dwn-sdk-js';
import base64url from 'base64url';

const queryMessage = async (target, recipient, queryFilter = {}) => {
  const { did: did1, dwnLocation } = target;
  const { did: did2, privateKeyJwk, keyId } = recipient;
  const signatureInput = {
    protectedHeader: {
      alg: 'ES256K',
      kid: `${did2}#${keyId}`,
    },
    jwkPrivate: privateKeyJwk,
  };
  const queryMessage = await CollectionsQuery.create({
    target: did1,
    filter: queryFilter,
    signatureInput,
  });
  const messages = [queryMessage.message];
  return await fetch(dwnLocation, {
    method: 'post',
    body: JSON.stringify({ messages }),
  });
};

export const cmd = new Command('query');
cmd.description('get personal data from DWebNode');
cmd.requiredOption('--targetDid <targetDid>', 'Target Did');
cmd.requiredOption('--recipientDid <recipientDid>', 'R$ecipient Did');
cmd.option(
  '--privateKeyJwkPath <privateKeyJwkPath>',
  'Path to privateKeyJwk JSON',
  './privateKey.json',
);
cmd.option('--filterPath <filterPath>', 'Path to Filter JSON', './filter.json');
cmd.option('--keyId <keyId>', 'ID for Key Pair', 'key-1');
cmd.option('--outPath <outPath>', 'Output Path', './out');

cmd.action(async () => {
  console.log('cmd.opts()', cmd.opts());
  const { privateKeyJwkPath, filterPath, keyId, outPath, targetDid, recipientDid } = cmd.opts();
  try {
    await fs.mkdir(outPath, { recursive: true });
  } catch (error) {
    console.error(error);
    return;
  }

  const didDoc = await resolve(targetDid);
  const dwnLocation = didDoc.didDocument.service[0].serviceEndpoint.nodes[0]; // todo error handling

  const _privateKeyJwk = await fs.readFile(privateKeyJwkPath, { encoding: 'utf8' });
  const privateKeyJwk = JSON.parse(_privateKeyJwk);
  const target = {
    did: targetDid,
    dwnLocation,
  };
  const recipient = {
    did: recipientDid,
    privateKeyJwk,
    keyId,
  };
  const _filter = await fs.readFile(filterPath, { encoding: 'utf8' });
  const filter = JSON.parse(_filter);

  const res = await queryMessage(target, recipient, filter);
  const body = await res.json();
  if (body.replies) {
    const reply = body.replies[0];
    if (reply.entries) {
      try {
        const fileName = targetDid.split(':').slice(0, 3).join(':');
        await Promise.all(
          reply.entries.map(async (entry) => {
            const { descriptor, encodedData } = entry;
            await fs.writeFile(`${outPath}/${fileName}.${descriptor.recordId}.json`, JSON.stringify(entry));

            if (encodedData) {
              const content = base64url.decode(encodedData);
              await fs.writeFile(`${outPath}/${fileName}.${descriptor.recordId}.data`, content);
            }
          }),
        );
      } catch (error) {
        console.error(error);
      }
    }
  }
});
